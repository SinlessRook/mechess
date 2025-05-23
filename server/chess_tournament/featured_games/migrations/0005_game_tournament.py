# Generated by Django 5.2 on 2025-04-29 15:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('featured_games', '0004_remove_game_tournament'),
        ('leaderboard', '0003_remove_tournament_games_tournament_currently_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='tournament',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='leaderboard.tournament'),
        ),
    ]
