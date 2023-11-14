# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .models import CustomUser

def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username=username, password=password)
        if user is not None:
            print("인증성공")
            login(request, user)
        else: 
            print("인증실패")
    return render(request, 'accounts/login.html')

def register_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        email = request.POST["email"] 
        firstname = request.POST["firstname"]
        lastname = request.POST["lastname"]
        language = request.POST["language"]
        
        user = CustomUser.objects.create_user(username, email, password)
        user.firstname = firstname
        user.lastname = lastname
        user.language = language
        user.save()
        
        login(request, user)
        
        return redirect('main')

    return render(request, 'accounts/register.html')


def logout_view(request):
    logout(request)
    return redirect('main')