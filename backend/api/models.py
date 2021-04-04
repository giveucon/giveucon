from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Account(AbstractUser):
    #Specify verbose_name
    class Meta:
        verbose_name = 'account'
        verbose_name_plural = 'accounts'

class User(models.Model):
    email = models.CharField(max_length=255, blank=False, null=False, unique=True)
    user_name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    first_name = models.CharField(max_length=255, blank=False, null=False)
    last_name = models.CharField(max_length=255, blank=False, null=False)
    #location
    dark_mode = models.BooleanField(default=False)

class AccountUser(models.Model):
    account = models.OneToOneField(
        Account,
        null=False,
        on_delete=models.CASCADE,
        related_name='account_user'
    )
    user = models.OneToOneField(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='account_user'
    )

class Article(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    content = models.TextField(blank=True, null=False)
    at = models.DateTimeField(null=False, default=timezone.now, editable=False)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='article'
    )

class Store(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)
    #location
    owner = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name='store')
    private_key = models.CharField(max_length=64, blank=False, null=False, unique=True)
    public_key = models.CharField(max_length=128, blank=False, null=False, unique=True)

class Product(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=False)
    price = models.PositiveIntegerField(null=False)
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='product'
    )
    class Meta:
        unique_together = ('name', 'store')

class Tag(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)

class StoreTag(models.Model):
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_tag'
    )
    tag = models.ForeignKey(
        Tag,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_tag'
    )
    class Meta:
        unique_together = ('store', 'tag')

class MenuItem(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)

class Image(models.Model):
    image = models.ImageField(null=False)

class Friend(models.Model):
    from_user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='friend_from'
    )
    to_user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='friend_to'
    )
    class Meta:
        unique_together = ('from_user', 'to_user')

class ArticleImage(models.Model):
    article = models.ForeignKey(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='article_image'
    )
    image = models.ForeignKey(
        Image,
        null=False,
        on_delete=models.CASCADE,
        related_name='article_image'
    )
    class Meta:
        unique_together = ('article', 'image')

class StoreImage(models.Model):
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_image'
    )
    image = models.ForeignKey(
        Image,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_image'
    )
    class Meta:
        unique_together = ('store', 'image')

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        null=False,
        on_delete=models.CASCADE,
        related_name='product_image'
    )
    image = models.ForeignKey(
        Image,
        null=False,
        on_delete=models.CASCADE,
        related_name='product_image'
    )
    class Meta:
        unique_together = ('product', 'image')

class Review(models.Model):
    score = models.PositiveIntegerField(null=False)
    article = models.ForeignKey(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='review'
    )

class UserMenuItem(models.Model):
    order = models.PositiveIntegerField(null=False)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='user_menu_item'
    )
    menu_item = models.ForeignKey(
        MenuItem,
        null=False,
        on_delete=models.CASCADE,
        related_name='user_menu_item'
    )
    class Meta:
        unique_together = ('user', 'menu_item')

class StoreReview(models.Model):
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_review'
    )
    review = models.ForeignKey(
        Review,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_review'
    )
    class Meta:
        unique_together = ('store', 'review')

class ProductReview(models.Model):
    product = models.ForeignKey(
        Product,
        null=False,
        on_delete=models.CASCADE,
        related_name='product_review'
    )
    review = models.ForeignKey(
        Review,
        null=False,
        on_delete=models.CASCADE,
        related_name='product_review'
    )
    class Meta:
        unique_together = ('product', 'review')

class Coupon(models.Model):
    until = models.DateTimeField(null=False)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='coupon'
    )
    product = models.ForeignKey(
        Product,
        null=False,
        on_delete=models.CASCADE,
        related_name='coupon'
    )

class Stamp(models.Model):
    max_count = models.PositiveIntegerField(null=False)
    count = models.PositiveIntegerField(null=False, default=0)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='stamp'
    )
    product = models.ForeignKey(
        Product,
        null=False,
        on_delete=models.CASCADE,
        related_name='stamp'
    )

class CouponSelling(models.Model):
    price = models.PositiveIntegerField(null=False)
    coupon = models.OneToOneField(
        Coupon,
        null=False,
        on_delete=models.CASCADE,
        related_name='coupon_selling'
    )

class StampSelling(models.Model):
    price = models.PositiveIntegerField(null=False)
    stamp = models.OneToOneField(
        Stamp,
        null=False,
        on_delete=models.CASCADE,
        related_name='stamp_selling'
    )

class CentralNotice(models.Model):
    article = models.OneToOneField(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='central_notice'
    )

class StoreNotice(models.Model):
    article = models.ForeignKey(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_notice'
    )
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='store_notice'
    )
    class Meta:
        unique_together = ('article', 'store')

class FavoriteStore(models.Model):
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='favorite_store'
    )
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='favorite_store'
    )
    class Meta:
        unique_together = ('store', 'user')

class FavoriteProduct(models.Model):
    product = models.ForeignKey(
        Product, 
        null=False,
        on_delete=models.CASCADE,
        related_name='favorite_product'
    )
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='favorite_product'
    )
    class Meta:
        unique_together = ('product', 'user')

#class Notification(models.Model):
