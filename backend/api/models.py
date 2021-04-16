from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class Account(AbstractUser):
    class Meta:
        verbose_name = 'account'
        verbose_name_plural = 'accounts'
    def __str__(self):
        return f"[{self.id}] {self.username}"

class User(models.Model):
    email = models.CharField(max_length=255, blank=False, null=False, unique=True)
    user_name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    first_name = models.CharField(max_length=255, blank=False, null=False)
    last_name = models.CharField(max_length=255, blank=False, null=False)
    #location
    dark_mode = models.BooleanField(default=False)
    def __str__(self):
        return f"[{self.id}] {self.user_name}"

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

class Image(models.Model):
    image = models.ImageField(null=False)

class Article(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    content = models.TextField(blank=True, null=False)
    created_at = models.DateTimeField(null=False, editable=False, default=timezone.now)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='article'
    )
    images = models.ManyToManyField(Image, blank=True)
    def __str__(self):
        return f"[{self.id}] {self.title}"

class Tag(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    def __str__(self):
        return f"[{self.id}] {self.name}"

class Store(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)
    #location
    private_key = models.CharField(max_length=64, blank=False, null=False, unique=True)
    public_key = models.CharField(max_length=128, blank=False, null=False, unique=True)
    user = models.ForeignKey(
        User,
        null=False,
        on_delete=models.CASCADE,
        related_name='store'
    )
    images = models.ManyToManyField(Image, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    def __str__(self):
        return f"[{self.id}] {self.name}"

class Product(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=False)
    price = models.PositiveIntegerField(null=False)
    duration = models.DurationField(null=False, default=timezone.timedelta(days=365))
    store = models.ForeignKey(
        Store,
        null=False,
        on_delete=models.CASCADE,
        related_name='product'
    )
    images = models.ManyToManyField(Image, blank=True)
    class Meta:
        unique_together = ('name', 'store')
    def __str__(self):
        return f"[{self.id}] {self.name}"

class MenuItem(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False, unique=True)
    def __str__(self):
        return f"[{self.id}] {self.name}"

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

class Review(models.Model):
    score = models.PositiveIntegerField(null=False)
    article = models.ForeignKey(
        Article,
        null=False,
        on_delete=models.CASCADE,
        related_name='review'
    )
    def __str__(self):
        return f"[{self.id}] {self.article.title}"

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
    signature = models.CharField(max_length=64, blank=False, null=True, unique=True)
    created_at = models.DateTimeField(null=False, editable=False, default=timezone.now)
    used = models.BooleanField(default=False)
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
    def __str__(self):
        return f"[{self.id}] Coupon of {self.product.name}"

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
    def __str__(self):
        return f"[{self.id}] {self.article.title}"

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
