from django.db import transaction
from rest_framework import serializers
from ..models import AccountUser
from ..models import User
from ..services import PhoneService
from .user_read_serializer import UserReadSerializer

class UserWriteSerializer(serializers.ModelSerializer):
    verification_code = serializers.CharField()
    class Meta:
        model = User
        read_only_fields = ('staff',)
        fields = '__all__'

    def validate(self, data):
        if self.context['request'].user.is_superuser:
            return data
        phone_number = data['phone_number']
        verification_code = data['verification_code']
        if not PhoneService.verify_phone_number(phone_number, verification_code):
            raise serializers.ValidationError({'verification_code': 'Invalid verification code'})
        return data

    def create(self, validated_data):
        with transaction.atomic():
            validated_data.pop('verification_code')
            account = validated_data.pop('account')
            print('account is ', account)
            user = User.objects.create(**validated_data)
            AccountUser.objects.create(account=account, user=user)
            return user

    def to_representation(self, instance):
        return UserReadSerializer(instance).data
