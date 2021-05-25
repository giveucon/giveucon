from django.db import transaction
from rest_framework import serializers
from ..models import AccountUser
from ..models import User
from ..services import PhoneService
from ..services import WalletService
from .user_read_serializer import UserReadSerializer

class UserWriteSerializer(serializers.ModelSerializer):
    verification_code = serializers.CharField(required=False)
    class Meta:
        model = User
        read_only_fields = ('staff', 'location')
        fields = '__all__'

    def create(self, validated_data):
        with transaction.atomic():
            verification_code = validated_data.pop('verification_code', None)
            if not self.context['request'].user.is_superuser:
                phone_number = validated_data['phone_number']
                if not PhoneService.verify_phone_number(phone_number, verification_code):
                    raise serializers.ValidationError({
                        'verification_code': 'Invalid verification code'
                    })
                wallet = validated_data['wallet']
                balance = WalletService.get_address_balance(wallet)
                if balance['status'] != 'success':
                    raise serializers.ValidationError({
                        'wallet': 'Invalid BTC wallet address'
                    })

            account = validated_data.pop('account')
            user = User.objects.create(**validated_data)
            AccountUser.objects.create(account=account, user=user)
            return user

    def update(self, instance, validated_data):
        with transaction.atomic():
            verification_code = validated_data.pop('verification_code', None)
            phone_number = validated_data['phone_number']
            wallet = validated_data['wallet']
            if not self.context['request'].user.is_superuser:
                if (instance.phone_number != phone_number
                    and not PhoneService.verify_phone_number(phone_number, verification_code)):
                        raise serializers.ValidationError({
                            'verification_code': 'Invalid verification code'
                        })
                if instance.wallet != wallet:
                    wallet = validated_data['wallet']
                    balance = WalletService.get_address_balance(wallet)
                    if balance['status'] != 'success':
                        raise serializers.ValidationError({
                            'wallet': 'Invalid BTC wallet address'
                        })

            return super().update(instance, validated_data)

    def to_representation(self, instance):
        return UserReadSerializer(instance).data
