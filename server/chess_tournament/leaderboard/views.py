from collections import defaultdict
import cloudscraper
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Tournament
from featured_games.models import Game

scraper = cloudscraper.create_scraper()

def fetch_rating(player, rating_cache):
    if player.chess_id in rating_cache:
        return rating_cache[player.chess_id]
    
    url = f"https://api.chess.com/pub/player/{player.chess_id}/stats"
    response = scraper.get(url)
    if response.status_code == 200:
        rating = response.json().get("chess_rapid", {}).get("last", {}).get("rating", 0)
        rating_cache[player.chess_id] = rating
        return rating
    rating_cache[player.chess_id] = 0
    return 0

@api_view(['GET'])
def get_leaderboard(request):
    tournament = Tournament.objects.filter(currently_active=True).first()
    if not tournament:
        return Response({"error": "No active tournament"})

    games = list(
        Game.objects.filter(tournament=tournament)
        .select_related('ply1', 'ply2')
        .order_by('round', 'id')
    )
    if not games:
        return Response({"rounds": [], "players": {}, "status": "success", "currentleader": None, "currenttournament": str(tournament.name)})

    def get_game_scores(result):
        if result == "1-0":
            return 1.0, 0.0
        if result == "0-1":
            return 0.0, 1.0
        if result == "1/2-1/2":
            return 0.5, 0.5
        # For pending/unknown results, award no points.
        return 0.0, 0.0

    rating_cache = {}
    player_scores = defaultdict(float)  # cumulative score keyed by player.id
    player_map = {}
    games_by_round = defaultdict(list)
    rounds = []

    for game in games:
        games_by_round[game.round].append(game)
        player_map[game.ply1.id] = game.ply1
        player_map[game.ply2.id] = game.ply2

    round_ids = sorted(games_by_round.keys())
    rounds = [{"id": round_id, "name": f"Round {round_id}"} for round_id in round_ids]

    all_player_ids = sorted(player_map.keys(), key=lambda pid: (player_map[pid].name.lower(), pid))
    leaderboard = {}

    for round_id in round_ids:
        round_points = defaultdict(float)
        for game in games_by_round[round_id]:
            score1, score2 = get_game_scores(game.result)
            player_scores[game.ply1.id] += score1
            player_scores[game.ply2.id] += score2
            round_points[game.ply1.id] += score1
            round_points[game.ply2.id] += score2

        round_name = f"Round {round_id}"
        snapshot = []
        for player_id in all_player_ids:
            player = player_map[player_id]
            gained = round_points[player_id]
            performance = f"+{gained:g}" if gained > 0 else "0"
            snapshot.append({
                "rank": 1,
                "name": player.name,
                "rating": fetch_rating(player, rating_cache),
                "score": player_scores[player_id],
                "performance": performance,
            })

        # Deterministic ordering: score desc, rating desc, name asc.
        snapshot.sort(key=lambda p: (-p["score"], -p["rating"], p["name"].lower()))

        # Competition ranking: 1, 2, 2, 4
        previous_score = None
        previous_rating = None
        previous_rank = 0
        for index, row in enumerate(snapshot, 1):
            score_key = row["score"]
            rating_key = row["rating"]
            if score_key == previous_score and rating_key == previous_rating:
                row["rank"] = previous_rank
            else:
                row["rank"] = index
                previous_rank = index
                previous_score = score_key
                previous_rating = rating_key

        leaderboard[round_name] = snapshot

    current_leader = leaderboard[rounds[-1]["name"]][0]["name"] if rounds else None

    return Response({
        "rounds": rounds,
        "players": leaderboard,
        "status": "success",
        "currentleader": current_leader,
        "currenttournament": str(tournament.name)
    })
