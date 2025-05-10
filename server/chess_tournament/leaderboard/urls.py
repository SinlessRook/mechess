from django.urls import path
from . import views

urlpatterns = [
    path('points/', views.get_leaderboard),
]
