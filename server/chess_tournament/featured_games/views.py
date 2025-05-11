import cloudscraper
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from .models import Featured

def analyse(white,black,link):
    id = (link.split("/")[-1]).rsplit("?")[0]
    url = f'https://www.chess.com/callback/live/game/{id}'
    response = requests.get(url)
    if response.status_code != 200:
        return None, None, None, None, None, None
    data = response.json()
    data = data.get("game")
    headers = data.get('pgnHeaders')
    timestamp = len((data.get('moveTimestamps')).split(",")) -1

    # Extracting specific details
    date = headers.get('Date')
    moves = timestamp//2 if timestamp % 2 == 0 else timestamp//2 + 1
    opening = headers.get('ECO')
    description = headers.get('Termination')
    duration = None  # Duration isn't directly provided
    image = None  # Image URL isn't directly provided
    return date, moves, opening, description, duration, image
def format_featured(games):
    # games[0] is the game id
    # games[1] is the white player
    # games[2] is the black player
    # games[3] is the tournament name
    # games[4] is the result
    # games[5] is the number of likes
    # games[6] is the number of dislikes
    # games[7] is the white chess id
    # games[8] is the black chess id
    # games[9] is the game link

    # Analyse game based on link
    # data[0] is the date
    # data[1] is the moves
    # data[2] is the opening
    # data[3] is the description
    # data[4] is the duration
    # data[5] is the image

    data = analyse(games[7],games[8],games[9])
    return {
            "id": games[0],
            "white": games[1],
            "black": games[2],
            "event": games[3],
            "date": data[0],
            "result": games[4],
            "moves": data[1],
            "opening": data[2],
            "description": data[3],
            "likes": games[5],
            "dislikes": games[6],
            "views": 0,
            "duration": data[4],
            "image": data[5],
            "userLiked": False,     # This depends on your app logic
            "userDisliked": False,  # This depends on your app logic
        }

@api_view(['GET'])
def get_featured_games(request):
    games = Featured.objects.select_related("game").all()
    data =[]
    for i in range(len(games)):
        temp=[]
        temp.append(i+1)
        temp.extend([games[i].game.ply1.name,games[i].game.ply2.name,games[i].game.tournament.name,games[i].game.result])
        temp.extend([games[i].like,games[i].dislike])
        temp.extend([games[i].game.ply1.chess_id,games[i].game.ply2.chess_id,games[i].game.link])
        data.append(format_featured(temp))

    return Response({"games": data}, status=200)
