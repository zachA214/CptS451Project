from django.contrib import admin
from .models import Product
from .models import Category
from .models import User

# Register your models here.
admin.site.register(User)
admin.site.register(Product)
admin.site.register(Category)