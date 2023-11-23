# Generated by Django 4.2.7 on 2023-11-16 09:59

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_remove_customuser_firstname_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="firstname",
            field=models.CharField(default=django.utils.timezone.now, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="customuser",
            name="lastname",
            field=models.CharField(default=django.utils.timezone.now, max_length=30),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="customuser",
            name="password",
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="username",
            field=models.CharField(max_length=30, unique=True),
        ),
    ]