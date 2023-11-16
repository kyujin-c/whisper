from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(str(e))
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = super().create(validated_data)

        # Set the password on the user instance and save it
        if password:
            instance.set_password(password)
            instance.save()

        return instance

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'firstname', 'lastname', 'language']
        extra_kwargs = {'password': {'write_only': True}}
