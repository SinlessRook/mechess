from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Featured, Game
from typing import TypedDict

class ChessGame(TypedDict):
    id: int
    white: str
    black: str
    event: str
    date: str
    result: str
    moves: int
    opening: str
    description: str
    likes: int
    dislikes: int
    views: int
    duration: str
    image: str
    userLiked: bool

@api_view(["GET"])
def get_featured_games(request):
    try:
        games = Featured.objects.all()
        output=[]
        for index,game in enumerate(games):
            game_field = Game.objects.get(id=game.game_id)
            req_game: ChessGame = {
                "id":index,
                "white":game_field.ply1.name,
                "black":game_field.ply2.name,
                "event":game_field.tournament.name,
                "date":None,
                "description":None,
                "dislikes":game.dislike,
                "likes":game.like,
                "moves":None,
                "opening":None,
                "result":game_field.result,
                "views":None,
                "duration":None,
                "image":"/placeholder.svg?height=200&width=350",
                "userLiked":False,
                "userDisliked":False
            }
            output.append(req_game)

        return Response({"featured games":output})
    except Featured.DoesNotExist:
        return Response({"message":"No featured games found"})