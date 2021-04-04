from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from ..models import User
from ..models import AccountUser
from ..serializers import UserSerializer

class CurrentUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def retrieve(self, request, *args, **kwargs):
        user = AccountUser.objects.get(account=request.user).user
        return Response(UserSerializer(user).data)
