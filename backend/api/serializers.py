from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    
    def validate_password(self, value):
        """
        Validate the password using Django's password validation.
        """
        validate_password(value)
        return value

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'firstname', 'lastname', 'language']
        extra_kwargs = {'password': {'write_only': True}}
