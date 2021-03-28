from django.urls import path
# from . import views
from .views import test_views, user_views

urlpatterns = [    
    path('test/hello/', test_views.hello),

    path('users/', user_views.UserList.as_view()),
    path('users/<int:pk>/', user_views.UserDetail.as_view()),
    path('current-user/', user_views.CurrentUserDetail.as_view()),
]
