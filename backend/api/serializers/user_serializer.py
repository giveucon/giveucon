from rest_framework.serializers import ModelSerializer
from ..models import User
from django.conf import settings


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "userId",
            "username",
            "email",

            "is_active",
            "is_staff",
            "is_superuser",
        
            "created_on",
            "updated_at",

            "dark_mode",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"]
        )

        return user
