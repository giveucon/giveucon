from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response

from ..models import Account
from ..models import AccountUser
from ..serializers import AccountSerializer


class SelfAccountDetailView(generics.RetrieveAPIView):
    queryset = Account.objects.all() # is this queryset needed? or properly used?
    serializer_class = AccountSerializer
    def retrieve(self, request, *args, **kwargs):
        account = request.user
        return Response(self.get_serializer(account).data)

    def update(self, request, *args, **kwargs):
        account = request.user
        serializer = self.get_serializer(account, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
