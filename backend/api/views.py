from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import (Order, Admin, UserAuth, Wishlist, ProductReview, User, Product, Category)

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

#User
###################################################################################
@api_view(['GET', 'POST'])
def get_add_users(request):
    if request.method == 'GET':
        try:
            user = User.objects.all()
            data = [{
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "is_admin": u.is_admin
                  } for u in user]
            
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    elif request.method == 'POST':
        try:
            User.objects.create(
                first_name=request.data['first_name'],
                last_name=request.data['last_name'],
                email=request.data['email'],
                is_admin=request.data['is_admin']
            )
            return Response({"message": "User added"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
#Order
###################################################################################
@api_view(['GET', 'POST'])
def get_add_order(request):
    if request.method == 'GET':
        try:
            order = Order.objects.all()
            data = [{
                "quantity": o.quantity,
                "total_price": o.total_price,
                "date": o.date,
                "status": o.status,
                "product_id": o.product.product_id,
                "user_id": o.user.user_id
                } for o in order]
            
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    elif request.method == 'POST':
        try:
            Order.objects.create(
                quantity=request.data['quantity'],
                total_price=request.data['total_price'],
                date=request.data['date'],
                status=request.data['status'],
                product_id=request.data['product_id'],
                user_id=request.data['user_id']
            )
            return Response({"message": "Order added"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

#Admin
###################################################################################
@api_view(['GET', 'POST'])
def get_add_admin(request):
    if request.method == 'GET':
        try:
            admin = Admin.objects.all()
            data = [{
                "order_id": a.order.order_id,
                "product_id": a.product.product_id,
                "user_id": a.user.user_id,
                  } for a in admin]
            
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    elif request.method == 'POST':
        try:
            Admin.objects.create(
                order_id=request.data['order_id'],
                product_id=request.data['product_id'],
                user_id=request.data['user_id']
            )
            return Response({"message": "admin added"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
#UserAuth
###################################################################################
@api_view(['GET', 'POST'])
def get_add_userauth(request):
    if request.method == 'GET':
        try:
            user = UserAuth.objects.all()
            data = [{
                "user_id": u.user.user_id,
                "username": u.username,
                "password": u.password,
                  } for u in user]
            
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    elif request.method == 'POST':
        try:
            UserAuth.objects.create(
                user_id=request.data['user_id'],
                username=request.data['username'],
                password=request.data['password']
            )
            return Response({"message": "User added"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)