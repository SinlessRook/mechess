from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=100)
    chess_id = models.CharField(max_length=50, unique=True)
    player_class = models.CharField(max_length=50)  # e.g. "Beginner", "Advanced"
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.chess_id})"
