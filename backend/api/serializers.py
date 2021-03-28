from rest_framework import serializers
from .models import User, Article

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ("password", )
        
