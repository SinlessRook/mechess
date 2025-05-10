from django.db import models
from players.models import Player
from leaderboard.models import Tournament
from django.core.exceptions import ValidationError

class Game(models.Model):
    ply1 = models.ForeignKey(Player, related_name='player1_games', on_delete=models.CASCADE)
    ply2 = models.ForeignKey(Player, related_name='player2_games', on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True)
    round = models.PositiveIntegerField(default=1)
    RESULT_CHOICES = [('1-0', 'White wins'),('0-1', 'Black wins'),('1/2-1/2', 'Draw'),]
    result = models.CharField(max_length=7, choices=RESULT_CHOICES,null=True, blank=True)
    link = models.URLField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.ply1.name} vs {self.ply2.name} ({self.result})"

class Featured(models.Model):
    game = models.OneToOneField(Game, on_delete=models.CASCADE)
    like = models.PositiveIntegerField(default=0)
    dislike = models.PositiveIntegerField(default=0)

    def clean(self):
        if not self.game or not self.game.link:
            raise ValidationError("The selected game must have a valid link to be featured.")

    def save(self, *args, **kwargs):
        self.full_clean()  # calls clean() and field validation
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Featured: {self.game}"
