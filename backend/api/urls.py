from django.urls import path, include
from .views import test_views

urlpatterns = [    
    # Test
    # test_views.py
    path('test/hello/', test_views.hello),
]
