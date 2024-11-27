# signals.py

from django.db.models.signals import post_delete
from django.dispatch import receiver
from ..models import  Project

@receiver(post_delete, sender=Project)
def update_user_last_project(sender, instance,  **kwargs):
    project = Project.objects.filter(owner=instance.owner).first()
    user = instance.owner
    if user:
        user.last_visited_project = project
        user.save(update_fields=['last_visited_project'])
    
