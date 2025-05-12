from django.core.management.base import BaseCommand
from django_seed import Seed
from faker import Faker
import random

from players.models import Player
from leaderboard.models import Tournament
from featured_games.models import Game, Featured

class Command(BaseCommand):
    help = 'Seed database with Players, Tournaments, Games, and Featured games'

    def handle(self, *args, **kwargs):
        seeder = Seed.seeder()
        fake = Faker()

        # Seed Players
        seeder.add_entity(Player, 20, {
            'name': lambda x: fake.name(),
            'chess_id': lambda x: fake.user_name() + str(random.randint(100, 999)),
            'player_class': lambda x: random.choice(['Beginner', 'Intermediate', 'Advanced']),
            'bio': lambda x: fake.sentence(nb_words=50)
        })

        # Seed Tournaments
        seeder.add_entity(Tournament, 10, {
            'name': lambda x: fake.catch_phrase(),
        })

        inserted_pks = seeder.execute()
        player_ids = list(Player.objects.values_list('id', flat=True))
        tournament_ids = list(Tournament.objects.values_list('id', flat=True))

        # Seed Games
        for _ in range(90):
            ply1_id, ply2_id = random.sample(player_ids, 2)
            game = Game.objects.create(
                ply1_id=ply1_id,
                ply2_id=ply2_id,
                tournament_id=random.choice(tournament_ids),
                round=random.randint(1, 7),
                result=random.choice(['1-0', '0-1', '1/2-1/2']),
                link = f'https://www.chess.com/game/live/{random.randint(100000000000,999999999999)}'
            )
            # 50% of games become featured
            if random.random() < 0.5:
                Featured.objects.create(
                    game=game,
                    like=random.randint(0, 100),
                    dislike=random.randint(0, 20)
                )

        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully!'))
