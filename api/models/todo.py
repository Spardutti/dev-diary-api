from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    date = models.DateField()
    project = models.ForeignKey('Project', on_delete=models.CASCADE)