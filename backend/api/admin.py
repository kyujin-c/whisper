# accounts/admin.py
from django.contrib import admin
from .models import CustomUser, KorScript, EngScript

admin.site.register(CustomUser)
admin.site.register(KorScript)
admin.site.register(EngScript)
