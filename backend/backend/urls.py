# yourproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('api.urls')),  # accounts 앱의 URL을 포함
]
