from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connections

class Command(BaseCommand):
    help = 'Sets sites and social applications for providing Kakao OAuth2'

    def handle(self, *args, **options):
        conn = connections['default']
        sql_query_django_site = f'UPDATE django_site SET name = \'{settings.DJANGO_BASE_URL}\', domain = \'{settings.DJANGO_BASE_URL}\' WHERE id = 1;'
        sql_query_socialapp = f'INSERT INTO socialaccount_socialapp VALUES (1, "kakao", "Kakao", \'{settings.DJANGO_KAKAO_APP_REST_API_KEY}\', "", "None");'
        sql_query_socialapp_sites = 'INSERT INTO socialaccount_socialapp_sites VALUES (1, 1, 1);'

        with conn.cursor() as cur:
            cur.execute(sql_query_django_site)
            cur.execute(sql_query_socialapp)
            cur.execute(sql_query_socialapp_sites)

        self.stdout.write('Successfully set social applications.')
