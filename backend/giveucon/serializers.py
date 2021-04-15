from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime

class TokenObtainLifetimeSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['access_token_lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        data['refresh_token_lifetime'] = int(refresh.lifetime.total_seconds())
        data['access_token_expiry'] = str(datetime.now() + refresh.access_token.lifetime)
        data['refresh_token_expiry'] = str(datetime.now() + refresh.lifetime)
        return data

class TokenRefreshLifetimeSerializer(TokenRefreshSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = RefreshToken(attrs['refresh'])
        data['access_lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        data['refresh_lifetime'] = int(refresh.lifetime.total_seconds())
        data['access_expiry'] = str(datetime.now() + refresh.access_token.lifetime)
        data['refresh_expiry'] = str(datetime.now() + refresh.lifetime)
        return data
