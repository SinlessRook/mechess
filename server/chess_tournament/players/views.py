from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Player
from leaderboard.models import Tournament
from featured_games.models import Game
from django.db.models import Q
import chess.pgn
from concurrent.futures import ThreadPoolExecutor, as_completed
import io
import cloudscraper

scraper = cloudscraper.create_scraper()


def format_record(record):
    win = record.get("win", 0)
    loss = record.get("loss", 0)
    draw = record.get("draw", 0)
    total_games = win + loss + draw

    winrate = round((win / total_games) * 100, 2) if total_games else 0
    drawrate = round((draw / total_games) * 100, 2) if total_games else 0
    lossrate = round((loss / total_games) * 100, 2) if total_games else 0

    return {
        "games": total_games,
        "winRate": winrate,
        "drawRate": drawrate,
        "lossRate": lossrate,
    }


def fetch_tournaments(player_id):
    return list(
        Tournament.objects
        .filter(game__in=Game.objects.filter(Q(ply1=player_id) | Q(ply2=player_id)))
        .values_list("name", flat=True)
        .distinct()
    )


def fetch_details(player_id):
    url = f"https://api.chess.com/pub/player/{player_id}/stats"
    response = scraper.get(url)
    stats = {"performance": {}}
    constant = {"win": 0, "loss": 0, "draw": 0}
    constant2=format_record(constant)

    if response.status_code != 200:
        return 0, 0, 0, 0, {"bullet": constant2, "rapid": constant2, "blitz": constant2}

    data = response.json()
    bullet = data.get("chess_bullet", {}).get("record", constant)
    rapid = data.get("chess_rapid", {})
    blitz = data.get("chess_blitz", {}).get("record", constant)

    stats["performance"] = {
        "bullet": format_record(bullet),
        "rapid": format_record(rapid.get("record", constant)),
        "blitz": format_record(blitz),
    }

    rapid_last = rapid.get("last", {})
    rapid_record = rapid.get("record", {})

    rating = rapid_last.get("rating", 0)
    wins = rapid_record.get("win", 0)
    losses = rapid_record.get("loss", 0)
    draws = rapid_record.get("draw", 0)

    return rating, wins, losses, draws, stats["performance"]


def fetch_games(player):
    games = (Game.objects.filter(Q(ply1=player) | Q(ply2=player)).order_by('-id')[:6]
             .values("ply1_id", "ply2__name", "result", "tournament__name")
    )
    return [
        {
            "opponent": g["ply2__name"],
            "result": g["result"],
            "date": None,
            "event": g["tournament__name"]
        } for g in games
    ]


def fetch_achievements(player):
    tournament1 = Tournament.objects.filter(Q(winner1=player))
    tournament2 = Tournament.objects.filter(Q(winner2=player))
    tournament3 = Tournament.objects.filter(Q(winner3=player))
    result = []
    for t in tournament1:
        result.append(f"Champion of {t}")
    for t in tournament2:
        result.append(f"Runner-up of {t}")
    for t in tournament3:
        result.append(f"Second runner-up of {t}")
    return result


def get_games_url(player_id):
    url = f"https://api.chess.com/pub/player/{player_id}/games/archives"
    
    response = scraper.get(url)
    if response.status_code == 200:
        return response.json().get("archives", [])
    return []


def calculate_favorite(openings):
    top = sorted(openings.items(), key=lambda x: x[1]["total"], reverse=True)[:5]
    return [
        {
            "name": name,
            "games": stat["total"],
            "winRate": round((stat["win"] / stat["total"] * 100), 2) if stat["total"] else 0
        }
        for name, stat in top
    ]


def fetch_openings(player_id, urls):
    count = 0
    openings = {}
    for url in reversed(urls):
        if count >= 250:
            break
        response = scraper.get(url)
        if response.status_code != 200:
            continue
        games = response.json().get("games", [])
        for g in games:
            if count >= 250:
                break
            game = chess.pgn.read_game(io.StringIO(g.get("pgn", "")))
            if not game:
                continue
            eco_url = game.headers.get("ECOUrl", "").split("/")[-1].replace("-", " ")
            if not eco_url:
                continue
            opening = eco_url.strip()
            if opening not in openings:
                openings[opening] = {"win": 0, "loss": 0, "draw": 0, "total": 0}
            result = game.headers.get("Result", "")
            player_color = "White" if game.headers.get("White", "").lower() == player_id.lower() else "Black"
            if result == "1-0":
                if player_color == "White":
                    openings[opening]["win"] += 1
                else:
                    openings[opening]["loss"] += 1
            elif result == "0-1":
                if player_color == "Black":
                    openings[opening]["win"] += 1
                else:
                    openings[opening]["loss"] += 1
            elif result == "1/2-1/2":
                openings[opening]["draw"] += 1
            openings[opening]["total"] += 1
            count += 1
    return calculate_favorite(openings)


@api_view(['GET'])
def fetch_statistics(request, player_id):
    try:
        player = Player.objects.get(id=player_id)
    except Player.DoesNotExist:
        return Response({"openings": [], "yearlyRating": [], "recentGames": []})
    
    recent_games = fetch_games(player.id)
    urls = get_games_url(player.chess_id)

    if not urls:
        return Response({"openings": [], "yearlyRating": [], "recentGames": recent_games})
    
    openings = fetch_openings(player.chess_id, urls)
    return Response({"openings": openings, "yearlyRating": [], "recentGames": recent_games})


@api_view(['GET'])
def get_players(request):
    players = Player.objects.all()
    result = []

    def fetch_player_data(player):
        rating, wins, losses, draws, performance = fetch_details(player.chess_id)
        return {
            "id": player.id,
            "name": player.name,
            "bio": player.bio,
            "title": player.player_class,
            "country": "India",
            "age": None,
            "trend": "up" if wins > losses else "down",
            "rating": rating,
            "wins": wins,
            "losses": losses,
            "draws": draws,
            "performance": f"+{wins - losses}" if wins > losses else f"-{losses - wins}",
            "achievements": fetch_achievements(player.id),
            "tournaments": fetch_tournaments(player.id),
            "stats": {
                "yearlyRating": [],
                "openings": [],
                "performance": performance
            }
        }

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetch_player_data, p) for p in players]
        for future in as_completed(futures):
            result.append(future.result())

    return Response(result)
