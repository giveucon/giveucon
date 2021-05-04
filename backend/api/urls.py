from django.urls import path, include
from .views import *

urlpatterns = [
    path("social/login/kakao/", SocialKakaoLoginView.as_view()),
    
    path('accounts/', AccountListView.as_view()),
    path('accounts/self/', SelfAccountDetailView.as_view()),

    path('articles/', ArticleListView.as_view()),
    path('articles/<int:pk>/', ArticleDetailView.as_view()),

    path('central-notices/', CentralNoticeListView.as_view()),
    path('central-notices/<int:pk>/', CentralNoticeDetailView.as_view()),

    path('images/', ImageListView.as_view()),
    path('images/<int:pk>/', ImageDetailView.as_view()),

    path('users/', UserListView.as_view()),
    path('users/self/', SelfUserDetailView.as_view()),
    path('users/<int:pk>/', UserDetailView.as_view()),

    path('stores/', StoreListView.as_view()),
    path('stores/<int:pk>/', StoreDetailView.as_view()),

    path('store-notices/', StoreNoticeListView.as_view()),
    path('store-notices/<int:pk>/', StoreNoticeDetailView.as_view()),

    path('products/', ProductListView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),

    path('images/', ImageListView.as_view()),
    path('images/<int:pk>/', ImageDetailView.as_view()),

    path('coupons/', CouponListView.as_view()),
    path('coupons/scan/', CouponScanView.as_view()),
    path('coupons/<int:pk>/', CouponDetailView.as_view()),

    path('tags/', TagListView.as_view()),
    path('tags/<int:pk>/', TagDetailView.as_view()),

    path('reviews/', ReviewListView.as_view()),
    path('reviews/<int:pk>/', ReviewDetailView.as_view()),

    path('store-reviews/', StoreReviewListView.as_view()),
    path('store-reviews/<int:pk>/', StoreReviewDetailView.as_view()),

    path('product-reviews/', ProductReviewListView.as_view()),
    path('product-reviews/<int:pk>/', ProductReviewDetailView.as_view()),

    path('favorite-stores/', FavoriteStoreListView.as_view()),
    path('favorite-stores/<int:pk>', FavoriteStoreDetailView.as_view()),

    path('favorite-products/', FavoriteProductListView.as_view()),
    path('favorite-products/<int:pk>', FavoriteProductDetailView.as_view()),

    path('dummy-users/', DummyUserCreateView.as_view()),
    path('dummy-stores/', DummyStoreCreateView.as_view()),
    path('dummy-products/', DummyProductCreateView.as_view()),
]
