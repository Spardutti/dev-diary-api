# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import User, Project

@receiver(post_save, sender=User)
def create_default_project(sender, instance, created, **kwargs):
    if created:  # Only run this logic when a new user is created
        project = Project.objects.create(owner=instance, name="Default Project")
        instance.last_visited_project = project
        instance.save()
