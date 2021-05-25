from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from ...models import CouponSellingStatus

class Command(BaseCommand):
    help = 'Initialize categorical models'

    def handle(self, *args, **options):
        if CouponSellingStatus.objects.count() == 0:
            CouponSellingStatus.objects.create(status='open')
            CouponSellingStatus.objects.create(status='pre_pending')
            CouponSellingStatus.objects.create(status='pending')
            CouponSellingStatus.objects.create(status='closed')
            self.stdout.write('Categorical objects have been successfully initialized.')
        else:
            self.stdout.write('Categorical objects are already initialized.')
