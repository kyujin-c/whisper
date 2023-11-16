# yourproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),  # main 앱의 URL을 포함
    path('api/', include('api.urls')),  # accounts 앱의 URL을 포함
    #path('whisper/', include('whisper.urls')),  # whisper 앱의 URL을 포함
]
