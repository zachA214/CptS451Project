from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import (Order, Admin, UserAuth, Wishlist, ProductReview, User, Product, Category)
from django.db.models import Avg

# Create your views here.
@api_view(['GET'])
def hello(request):
    return Response({"message": "Hello from Django!"})


#Wishlist
###################################################################################
@api_view(['GET'])
def get_wishlist(request):
    #user = request.user
    user = User.objects.first() # for testing

    wishlist = Wishlist.objects.filter(user=user)

    data = []
    for item in wishlist:
        p = item.product
        data.append({
            "id": item.id,
            "product": {
                "product_id": p.product_id,
                "name": p.name,
                "price": p.price,
                "img_val": p.img_val
            }
        })

    return Response(data)

@api_view(['POST'])
def addItem_wishlist(request):
    #user = request.user
    user = User.objects.first() # for testing

    product_id = request.data.get('product_id')

    print("USER:", user)
    print("PRODUCT:", product_id)

    Wishlist.objects.get_or_create(
        user=user,
        product_id=product_id
    )

    return Response({"message": "Added"})

@api_view(['DELETE'])
def removeitem_wishlist(request, product_id):
    #user = request.user
    user = User.objects.first() # for testing

    Wishlist.objects.filter(
        user=user,
        product_id=product_id
    ).delete()

    return Response({"message": "Removed"})

#reviews
###################################################################################
@api_view(['GET'])
def get_reviews(request, product_id):
    reviews = ProductReview.objects.filter(product_id=product_id)

    data = [{
        "rating": r.rating,
        "comment": r.comment
    } for r in reviews]

    return Response(data)

@api_view(['POST'])
def add_review(request):
    user = User.objects.first() # for testing

    ProductReview.objects.create(
        user=user,
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
            if Category.objects.filter(category_id=category_id).exists():
                Category.objects.filter(category_id=category_id).delete()
                return Response({"message": "Category removed"}, status=200)
            else:
                return Response({"message": "Category does not exist"}, status=400)
        except Exception as e:
            return Response({"message": str(e)}, status=404)
    elif request.method == 'PATCH':
        try:
            category = Category.objects.get(category_id=category_id)
            category.cName = request.data['cName']
            category.save()
            return Response({"message": "Category updated"}, status=200)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)
        
@api_view(['GET'])
def get_category_count(request):
    if request.method == 'GET':
        try:
            count = Category.objects.count()
            return Response({"category_count": count}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

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
        
@api_view(['GET', 'DELETE', 'PATCH'])
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
    elif request.method == 'PATCH':
        try:
            product = Product.objects.get(product_id=product_id)
            product.name = request.data['name']
            product.description = request.data['description']
            product.inventory = request.data['inventory']
            product.price = request.data['price']
            product.img_val = request.data.get('img_val')
            product.category_id = request.data.get('category_id')
            product.save()
            return Response({"message": "Product updated"}, status=200)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        
@api_view(['GET'])
def get_product_count(request):
    if request.method == 'GET':
        try:
            count = Product.objects.count()
            return Response({"product_count": count}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

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
        
@api_view(['GET'])
def get_user_count(request):
    if request.method == 'GET':
        try:
            count = User.objects.filter(is_admin=False).count()
            return Response({"user_count": count}, status=200)
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
        
@api_view(['GET'])
def get_order_count(request):
    if request.method == 'GET':
        try:
            count = Order.objects.count()
            return Response({"order_count": count}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def get_avg_sale(request):
    if request.method == 'GET':
        try:
            avg = Order.objects.aggregate(totalAvg=Avg('total_price'))['totalAvg']
            string_avg = f"{avg:.2f}"
            return Response({"avg_total": float(string_avg)}, status=200)
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