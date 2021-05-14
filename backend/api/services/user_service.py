from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import NotAuthenticated
from ..models import AccountUser

class UserService():
    @staticmethod
    def get_current_user(request):
        try:
            account_user = AccountUser.objects.get(account=request.user)
            return account_user.user
        except ObjectDoesNotExist:
            raise NotAuthenticated(detail='Current user does not exist')
