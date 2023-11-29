# accounts/urls.py
from django.urls import path
from .views import api_login, api_logout, api_register, check_unique_username, stop_recording, start_recording, update_language, AudioUploadView, get_random_script

urlpatterns = [
    path('login/', api_login, name='login'),
    path('register/', api_register, name='register'),
    path('logout/', api_logout, name='logout'),
    path('check_unique_username/', check_unique_username, name='check_unique_username'),
    path('start_recording/', start_recording, name='start_recording'),
    path('stop_recording/', stop_recording, name='stop_recording'),
    path('update_language/', update_language, name='update_language'),
    path('upload_audio/', AudioUploadView.as_view(), name='upload_audio'),
    path('check_accuracy/', get_random_script, name='get_random_script')


    # 다른 accounts 앱의 URL 패턴들...
]
