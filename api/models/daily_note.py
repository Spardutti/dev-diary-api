from django.db import models
from html_sanitizer import Sanitizer

sanitizer = Sanitizer()

class DailyNote(models.Model):
    date = models.DateField()
    note = models.TextField()
    project = models.ForeignKey('Project', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # Sanitize the HTML before saving
        self.note = sanitizer.sanitize(self.note)
        super().save(*args, **kwargs)