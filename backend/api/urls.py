from django.urls import path
# from .views import 
from .views import *

urlpatterns = [
    path('categories/', get_add_categories),
    path('categories/<int:category_id>/', category_details),
    path('products/', get_add_products),
    path('products/<int:product_id>/', product_details),
    path('wishlist/', addItem_wishlist),
    path('review/', add_review),
    path('order/', get_add_order),
    path('users/', get_add_users),
    path('userauth/', get_add_userauth),
    path('admin/', get_add_admin)
]