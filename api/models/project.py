from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey('User', on_delete=models.CASCADE)

    def delete(self, *args, **kwargs):

        if self.owner.last_project == self:
            next_project = Project.objects.filter(owner=self.owner).exclude(id=self.id).first() # type: ignore

            if next_project:
                self.owner.last_project = next_project
                self.owner.save()
            else:
                raise ValueError("Cannot delete the last project for this user.")

        super().delete(*args, **kwargs)