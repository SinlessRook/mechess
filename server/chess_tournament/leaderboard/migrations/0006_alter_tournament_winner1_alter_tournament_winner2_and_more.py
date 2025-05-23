# Generated by Django 5.2 on 2025-04-30 18:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leaderboard', '0005_remove_tournament_winner1_remove_tournament_winner2_and_more'),
        ('players', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournament',
            name='winner1',
            field=models.ManyToManyField(blank=True, related_name='first_place', to='players.player'),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='winner2',
            field=models.ManyToManyField(blank=True, related_name='second_place', to='players.player'),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='winner3',
            field=models.ManyToManyField(blank=True, related_name='third_place', to='players.player'),
        ),
    ]
