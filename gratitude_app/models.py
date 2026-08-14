from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Entry(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="gratitude_entries")
    date = models.DateField(default=timezone.now)
    content = models.TextField(help_text="One paragraph of daily gratitude.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('owner', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.owner.username} - {self.date}"