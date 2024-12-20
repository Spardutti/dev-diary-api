from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey('User', on_delete=models.CASCADE)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def delete(self, *args, **kwargs):

        if self.owner.last_visited_project_id == self.id: # type: ignore
            next_project = Project.objects.filter(owner=self.owner).exclude(id=self.id).first() # type: ignore
            if next_project:
                self.owner.last_visited_project_id = next_project
            else:
                raise ValueError("Cannot delete the last project for this user.")

        super().delete(*args, **kwargs)