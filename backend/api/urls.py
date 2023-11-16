# accounts/urls.py
from django.urls import path
from .views import api_login, api_logout, api_register

urlpatterns = [
    path('login/', api_login, name='login'),
    path('register/', api_register, name='register'),
    path('logout/', api_logout, name='logout'),
    # 다른 accounts 앱의 URL 패턴들...
]
