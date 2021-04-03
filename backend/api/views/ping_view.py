from django.http import HttpResponse
from rest_framework import status, permissions
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView


@permission_classes([permissions.AllowAny,])
class PingView(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def ping(request):
        return HttpResponse('pong')
