from django.urls import path
# from .views import 
from .views import *

urlpatterns = [
    path('hello/', hello),
    path('categories/', get_add_categories),
    path('categories/<int:category_id>/', category_details),
    path('products/', get_add_products),
    path('products/<int:product_id>/', product_details),
]