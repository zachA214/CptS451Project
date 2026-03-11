from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Wishlist, ProductReview

# Create your views here.
@api_view(['GET'])
def hello(request):
    return Response({"message": "Hello from Django!"})

@api_view(['POST'])
def addItem_wishlist(request):
    user = request.user
    product_id = request.data.get('product_id')

    Wishlist.objects.get_or_create(
        user=user, product_id=product_id
    )

    return Response({"message": "Added"})

@api_view(['DELETE'])
def removeitem_wishlist(request):
    user = request.user
    product_id = request.data.get('product_id')

    Wishlist.objects.filter(
        user=user, product_id=product_id
    ).delete()

    return Response({"message": "Removed"})

@api_view(['POST'])
def add_review(request):
    ProductReview.objects.create(
        user=request.user,
        product_id=request.data['product_id'],
        rating=request.data['rating'],
        comment=request.data.get('comment', '')
    )

    return Response({"message": "Review saved"})