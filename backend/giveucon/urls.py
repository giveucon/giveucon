"""giveucon URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView
from .views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/rest-auth/token/verify/', TokenVerifyView.as_view(), name='token-verify'),
    path('api/rest-auth/token/obtain/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('api/rest-auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    # path("api/rest-auth/", include("dj_rest_auth.urls")),  # endpoints provided by dj-rest-auth
    path('api/rest-auth/register/', include('dj_rest_auth.registration.urls')),
    path('api/all-auth/', include('allauth.urls')),
    path("api/", include("api.urls")),  # our own views
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
