from datetime import date, timedelta

from django.core.management.base import BaseCommand

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Resetting OctoFit sample data...')

        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()

        users = {
            'spider_man': User.objects.create(
                email='spider-man@teammarvel.test',
                name='Spider-Man',
                team='Team Marvel',
                is_superhero=True,
            ),
            'captain_marvel': User.objects.create(
                email='captain-marvel@teammarvel.test',
                name='Captain Marvel',
                team='Team Marvel',
                is_superhero=True,
            ),
            'black_panther': User.objects.create(
                email='black-panther@teammarvel.test',
                name='Black Panther',
                team='Team Marvel',
                is_superhero=True,
            ),
            'batman': User.objects.create(
                email='batman@teamdc.test',
                name='Batman',
                team='Team DC',
                is_superhero=True,
            ),
            'superman': User.objects.create(
                email='superman@teamdc.test',
                name='Superman',
                team='Team DC',
                is_superhero=True,
            ),
            'wonder_woman': User.objects.create(
                email='wonder-woman@teamdc.test',
                name='Wonder Woman',
                team='Team DC',
                is_superhero=True,
            ),
        }

        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.add(
            users['spider_man'],
            users['captain_marvel'],
            users['black_panther'],
        )

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.add(
            users['batman'],
            users['superman'],
            users['wonder_woman'],
        )

        activity_seed = [
            (users['spider_man'], 'Wall Climb Intervals', 45, 1),
            (users['captain_marvel'], 'Flight Sprints', 60, 2),
            (users['black_panther'], 'Vibranium Circuit', 40, 3),
            (users['batman'], 'Rooftop HIIT', 50, 1),
            (users['superman'], 'Solar Endurance Run', 70, 2),
            (users['wonder_woman'], 'Amazon Strength Session', 55, 3),
        ]

        for user, activity_type, duration, days_ago in activity_seed:
            Activity.objects.create(
                user=user,
                type=activity_type,
                duration=duration,
                date=date.today() - timedelta(days=days_ago),
            )

        Leaderboard.objects.bulk_create(
            [
                Leaderboard(team='Team Marvel', points=980),
                Leaderboard(team='Team DC', points=940),
            ]
        )

        Workout.objects.bulk_create(
            [
                Workout(
                    name='Avengers Power Circuit',
                    description='A mixed strength and agility circuit for Team Marvel heroes.',
                    suggested_for='Team Marvel',
                ),
                Workout(
                    name='Justice League Endurance Drill',
                    description='A speed and stamina workout designed for Team DC heroes.',
                    suggested_for='Team DC',
                ),
                Workout(
                    name='Hero Recovery Flow',
                    description='Mobility and recovery session for all superhero athletes.',
                    suggested_for='All Teams',
                ),
            ]
        )

        self.stdout.write(self.style.SUCCESS('Populated octofit_db with superhero test data.'))