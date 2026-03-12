from django.db import models

# Create your models here.

# User
class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, blank=True)  

    def __str__(self):
        return self.username

#Category
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    cName = models.CharField(max_length=30)

    def __str__(self):
        return self.cName

#Product
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    description = models.TextField(blank=True)
    inventory = models.IntegerField(default=0)
    price = models.FloatField()
    img_val = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

# Wishlist
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'product')

# Product Review
class ProductReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    rating = models.IntegerField()
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
