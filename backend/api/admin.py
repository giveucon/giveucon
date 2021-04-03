from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = (
        'username',
        'email',
        'created_on',
    )

    list_display_links = (
        'username',
        'email',
    )
