from django.urls import path
from . import views


urlpatterns = [    
    path('hello/', views.hello),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
]
