# main/urls.py
from django.urls import path
from .views import mainPage
from api.views import api_login, api_register  # accounts 앱의 login_view 가져오기


urlpatterns = [
    path('', mainPage, name='main'),
    path('main/', mainPage, name='main'),
    path('login/', api_login, name='login'),
    path('register/', api_register, name='register'),
    # 다른 main 앱의 URL 패턴들을 추가할 수 있습니다.
]
