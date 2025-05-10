from django.db import models
from players.models import Player

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    currently_active = models.BooleanField(default=True)
    winner1 = models.ManyToManyField(Player,blank=True, related_name='first_place')
    winner2 = models.ManyToManyField(Player,blank=True, related_name='second_place')
    winner3 = models.ManyToManyField(Player,blank=True, related_name='third_place')
    def __str__(self):
        return self.name
