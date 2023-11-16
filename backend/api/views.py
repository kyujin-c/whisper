# accounts/views.py
from rest_framework import status
from rest_framework.response import Response
from .serializers import CustomUserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
    else:
        return HttpResponse(status=405)  # Method Not Allowed

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'success': True}, status=200)
    else:
        return JsonResponse({'success': False}, status=200) 
    

@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def api_register(request):
    print(request.data)
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return JsonResponse({'success': True, 'message': 'Account created successfully'}, status=status.HTTP_201_CREATED)
        return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        # For testing purposes only! In a real application, use POST requests.
        return Response({'message': 'GET request received for registration endpoint'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)