# accounts/admin.py
from django.contrib import admin
from .models import CustomUser, Script

admin.site.register(CustomUser)
admin.site.register(Script)
