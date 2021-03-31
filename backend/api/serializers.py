from rest_framework.serializers import ModelSerializer
from .models import User
from django.conf import settings


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "userId",
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"]
        )

        return user
