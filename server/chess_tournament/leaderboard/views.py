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

    games = Game.objects.filter(tournament=tournament).select_related('ply1', 'ply2').order_by('round')
    if not games.exists():
        return Response({"rounds": [], "players": {}, "status": "success", "currentleader": None, "currenttournament": str(tournament.name)})

    rating_cache = {}
    player_scores = defaultdict(float)
    leaderboard = defaultdict(list)
    rounds = []
    round_ids = set()

    for game in games:
        print(game)
        if game.round not in round_ids:
            round_ids.add(game.round)
            rounds.append({"id": game.round, "name": f"Round {game.round}"})

        player1, player2 = game.ply1, game.ply2
        score1, score2 = 0, 0
        if game.result == "1-0":
            score1, score2 = 1, 0
        elif game.result == "0-1":
            score1, score2 = 0, 1
        else:
            score1 = score2 = 0.5

        player_scores[player1.name] += score1
        player_scores[player2.name] += score2

        round_name = f"Round {game.round}"
        leaderboard[round_name].append({
            "rank": 1,
            "name": player1.name,
            "rating": fetch_rating(player1, rating_cache),
            "score": player_scores[player1.name],
            "performance": ""
        })
        leaderboard[round_name].append({
            "rank": 1,
            "name": player2.name,
            "rating": fetch_rating(player2, rating_cache),
            "score": player_scores[player2.name],
            "performance": ""
        })

    # Sort leaderboard and assign ranks
    for round_name in leaderboard:
        leaderboard[round_name].sort(key=lambda p: p["score"], reverse=True)
        for i, p in enumerate(leaderboard[round_name], 1):
            p["rank"] = i

    rounds.sort(key=lambda x: x["id"])
    current_leader = leaderboard[rounds[-1]["name"]][0]["name"]

    return Response({
        "rounds": rounds,
        "players": leaderboard,
        "status": "success",
        "currentleader": current_leader,
        "currenttournament": str(tournament.name)
    })
