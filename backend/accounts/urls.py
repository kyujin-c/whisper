# accounts/urls.py
from django.urls import path
from .views import login_view, register_view, logout_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    # 다른 accounts 앱의 URL 패턴들...
]
