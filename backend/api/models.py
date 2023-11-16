# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    lastname = models.CharField(max_length=30)
    firstname = models.CharField(max_length=30)
    language = models.CharField(max_length=30)

    class Meta:
        permissions = []