from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from ...models import Account

class Command(BaseCommand):
    help = 'Initialize admin account'

    def handle(self, *args, **options):
        if Account.objects.count() == 0:
            admin = Account.objects.create_superuser(email=settings.DJANGO_ADMIN_EMAIL, username=settings.DJANGO_ADMIN_USERNAME, password=settings.DJANGO_ADMIN_PASSWORD)
            admin.is_active = True
            admin.is_admin = True
            admin.save()
            self.stdout.write('Admin account initialized.')
        else:
            self.stdout.write('Admin account can only be initialized if no Accounts exist.')
