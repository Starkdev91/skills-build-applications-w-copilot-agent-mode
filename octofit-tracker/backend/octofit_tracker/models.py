from djongo import models

class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    team = models.CharField(max_length=50, db_index=True)
    is_superhero = models.BooleanField(default=False)

class Team(models.Model):
    name = models.CharField(max_length=50, unique=True)
    members = models.ArrayReferenceField(to=User, on_delete=models.CASCADE, related_name='team_members')

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    duration = models.IntegerField()
    date = models.DateField()

class Leaderboard(models.Model):
    team = models.CharField(max_length=50)
    points = models.IntegerField()

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    suggested_for = models.CharField(max_length=50)
