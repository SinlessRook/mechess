from django.urls import path
from .views import get_featured_games

urlpatterns = [path('games/', get_featured_games),]
