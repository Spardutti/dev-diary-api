from django.db import models
from html_sanitizer import Sanitizer

sanitizer = Sanitizer()

class DailyNote(models.Model):
    date = models.DateField()
    note = models.TextField()
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Sanitize the HTML before saving
        self.note = sanitizer.sanitize(self.note)
        super().save(*args, **kwargs)