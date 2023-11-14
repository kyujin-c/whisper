# main/urls.py
from django.urls import path
from .views import mainPage
from accounts.views import login_view, register_view  # accounts 앱의 login_view 가져오기


urlpatterns = [
    path('', mainPage, name='main'),
    path('main/', mainPage, name='main'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    # 다른 main 앱의 URL 패턴들을 추가할 수 있습니다.
]
