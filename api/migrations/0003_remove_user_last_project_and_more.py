# Generated by Django 5.1.3 on 2024-11-25 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_is_guest'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='last_project',
        ),
        migrations.AddField(
            model_name='user',
            name='last_visited_project_id',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]