from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from uuid import uuid4


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        """
          Creates a custom user with the given fields
        """

        user = self.model(
            username = username,
            email = self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using = self._db)

        return user

  
    def create_superuser(self, username, email, password):
        user = self.create_user(
            username,
            email,
            password = password
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using = self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    userId    = models.CharField(max_length = 16, default = uuid4, primary_key = True, editable = False)
    username  = models.CharField(max_length = 16, unique = True, null = False, blank = False)
    email     = models.EmailField(max_length = 100, unique = True, null = False, blank = False)
    #location
    dark_mode = models.BooleanField(default=False)
    #public_key
    #private_key

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    active       = models.BooleanField(default = True)
  
    is_staff     = models.BooleanField(default = False)
    is_superuser = models.BooleanField(default = False)
  
    created_on   = models.DateTimeField(auto_now_add = True, blank = True, null = True)
    updated_at   = models.DateTimeField(auto_now = True)

    objects = UserManager()

    class Meta:
        verbose_name = "Custom User"



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
