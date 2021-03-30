from rest_framework import serializers
from django.conf import settings
from .models import Profile

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Profile
        fields = ['id', 'owner', 'username', 'full_name', 'date', 'avatar', 'bio', 'snippet', 'slug', 'dark_mode']
