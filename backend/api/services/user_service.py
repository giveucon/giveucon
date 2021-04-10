from django.shortcuts import get_object_or_404
from ..models import AccountUser

class UserService():
    @staticmethod
    def get_current_user(request):
        return get_object_or_404(AccountUser, account=request.user).user
