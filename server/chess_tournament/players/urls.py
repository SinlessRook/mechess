from .views import get_players,fetch_statistics
from django.urls import path

urlpatterns = [
    path('details/', get_players,), 
    path('details/<int:player_id>', fetch_statistics) 
]