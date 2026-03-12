from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Wishlist, ProductReview, Product, Category

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

#Category
###################################################################################
@api_view(['GET', 'POST'])
def get_add_categories(request):
    if request.method == 'GET':
        try:
            categories = Category.objects.all()
            data = [{"id": c.category_id, "name": c.cName} for c in categories]
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    elif request.method == 'POST':
        try:
            Category.objects.create(
                cName=request.data['cName']
            )
            return Response({"message": "Category added"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        

@api_view(['GET', 'DELETE', 'PATCH'])
def category_details(request, category_id):
    if request.method == 'GET':
        try:
            category = Category.objects.get(category_id=category_id)
            data = {"id": category.category_id, "name": category.cName}
            return Response(data, status=200)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)
        
    elif request.method == 'DELETE':
        try:
            Category.objects.filter(category_id=category_id).delete()
            return Response({"message": "Category removed"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=404)
    elif request.method == 'PATCH':
        try:
            category = Category.objects.get(category_id=category_id)
            category.cName = request.data['cName']
            category.save()
            return Response({"message": "Category updated"}, status=200)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)

    
#Product
###################################################################################
@api_view(['GET', 'POST'])
def get_add_products(request):
    if request.method == 'GET':
        try:
            product = Product.objects.all()
            data = [{
                "id": p.product_id , 
                "name": p.name, 
                "description": p.description, 
                "inventory": p.inventory, 
                "price":p.price,
                "image_val": p.img_val,
                "category_id": p.category.category_id
                  } for p in product]
            
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    elif request.method == 'POST':
        try:
            Product.objects.create(
                name=request.data['name'],
                description=request.data['description'],
                inventory=request.data['inventory'],
                price=request.data['price'],
                img_val=request.data.get('img_val'),
                category_id=request.data.get('category_id')
            )
            return Response({"message": "Product added"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
@api_view(['GET', 'DELETE'])
def product_details(request, product_id):
    if request.method == 'GET':
        try:
            product = Product.objects.get(product_id=product_id)
            data = {"id": product.product_id, 
                    "name": product.name, 
                    "description": product.description, 
                    "inventory": product.inventory, 
                    "price": product.price, 
                    "image_val": product.img_val, 
                    "category_id": product.category.category_id
                    }
            
            return Response(data, status=200)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        
    elif request.method == 'DELETE':
        try:
            Product.objects.filter(product_id=product_id).delete()
            return Response({"message": "Product removed"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=404)

