# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)
    language = models.CharField(max_length=30)

    class Meta:
        permissions = []
        

class KorScript(models.Model):
    text = models.TextField()
    
    
class EngScript(models.Model):
    text = models.TextField()