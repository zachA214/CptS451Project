from django.urls import path
# from .views import 
from .views import *

urlpatterns = [
    path('categories/', get_add_categories),
    path('categories/<int:category_id>/', category_details),
    path('products/', get_add_products),
    path('products/<int:product_id>/', product_details),
    path('wishlist/', get_wishlist),
    path('wishlist/add/', addItem_wishlist), 
    path('wishlist/remove/<int:product_id>/', removeitem_wishlist),
    path('review/', add_review),
    path('review/<int:product_id>/', get_reviews),
    path('order/', get_add_order),
    path('users/', get_add_users),
    path('userauth/', get_add_userauth),
    path('admin/', get_add_admin),
    path('users/count/', get_user_count),
    path('products/count/', get_product_count),
    path('categories/count/', get_category_count),
    path('orders/count/', get_order_count),
    path('orders/averagesale/', get_avg_sale),
]