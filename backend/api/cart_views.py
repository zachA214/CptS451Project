from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Cart, Product, User, Order


def _get_test_user():
    return User.objects.first()


def _cart_item_to_json(ci: Cart):
    p = ci.product
    return {
        "cart_id": ci.cart_id,
        "product": {
            "product_id": p.product_id,
            "name": p.name,
            "price": p.price,
            "img_val": p.img_val,
            "inventory": p.inventory,
        },
        "quantity": ci.quantity,
        "line_total": ci.total,
    }


@api_view(["GET"])
def get_cart(request):
    user = _get_test_user()
    if user is None:
        return Response({"error": "No test user exists yet"}, status=400)

    items = Cart.objects.select_related("product").filter(user=user).order_by("cart_id")
    data = [_cart_item_to_json(ci) for ci in items]
    total = sum((ci.total for ci in items), 0.0)

    return Response({"items": data, "total": total}, status=200)


@api_view(["POST"])
def cart_add(request):
    user = _get_test_user()
    if user is None:
        return Response({"error": "No test user exists yet"}, status=400)

    product_id = request.data.get("product_id")
    quantity_raw = request.data.get("quantity", 1)

    try:
        product_id = int(product_id)
    except (TypeError, ValueError):
        return Response({"error": "product_id must be an integer"}, status=400)

    try:
        quantity = int(quantity_raw)
    except (TypeError, ValueError):
        return Response({"error": "quantity must be an integer"}, status=400)

    if quantity < 1:
        return Response({"error": "quantity must be >= 1"}, status=400)

    try:
        product = Product.objects.get(product_id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    # We don't block add-to-cart on stock here; checkout enforces stock.
    ci = Cart.objects.filter(user=user, product=product).first()
    if ci is None:
        ci = Cart(user=user, product=product, quantity=quantity, total=product.price * quantity)
    else:
        ci.quantity = ci.quantity + quantity
        ci.total = product.price * ci.quantity

    ci.save()
    return Response(_cart_item_to_json(ci), status=200)


@api_view(["PUT"])
def cart_update(request):
    user = _get_test_user()
    if user is None:
        return Response({"error": "No test user exists yet"}, status=400)

    product_id = request.data.get("product_id")
    quantity_raw = request.data.get("quantity")

    try:
        product_id = int(product_id)
    except (TypeError, ValueError):
        return Response({"error": "product_id must be an integer"}, status=400)

    try:
        quantity = int(quantity_raw)
    except (TypeError, ValueError):
        return Response({"error": "quantity must be an integer"}, status=400)

    if quantity < 1:
        return Response({"error": "quantity must be >= 1"}, status=400)

    ci = Cart.objects.select_related("product").filter(user=user, product_id=product_id).first()
    if ci is None:
        return Response({"error": "Item not in cart"}, status=404)

    ci.quantity = quantity
    ci.total = ci.product.price * quantity
    ci.save()
    return Response(_cart_item_to_json(ci), status=200)


@api_view(["DELETE"])
def cart_remove(request):
    user = _get_test_user()
    if user is None:
        return Response({"error": "No test user exists yet"}, status=400)

    product_id = request.query_params.get("product_id")
    try:
        product_id = int(product_id)
    except (TypeError, ValueError):
        return Response({"error": "product_id must be an integer"}, status=400)

    deleted, _ = Cart.objects.filter(user=user, product_id=product_id).delete()
    if deleted == 0:
        return Response({"error": "Item not in cart"}, status=404)
    return Response({"message": "Removed"}, status=200)


@api_view(["POST"])
def checkout(request):
    user = _get_test_user()
    if user is None:
        return Response({"error": "No test user exists yet"}, status=400)

    with transaction.atomic():
        cart_items = list(Cart.objects.select_related("product").select_for_update().filter(user=user))
        if not cart_items:
            return Response({"error": "Cart is empty"}, status=400)

        # Validate stock
        insufficient = []
        for ci in cart_items:
            if ci.product.inventory < ci.quantity:
                insufficient.append(
                    {
                        "product_id": ci.product.product_id,
                        "requested": ci.quantity,
                        "available": ci.product.inventory,
                    }
                )

        if insufficient:
            return Response({"error": "Insufficient stock", "items": insufficient}, status=409)

        # Create orders (one row per cart item, using existing Order model)
        created_orders = []
        total_price = 0.0

        for ci in cart_items:
            p = ci.product
            line_total = float(p.price) * int(ci.quantity)
            total_price += line_total

            # reduce stock
            p.inventory = p.inventory - ci.quantity
            p.save()

            o = Order.objects.create(
                user=user,
                product=p,
                quantity=ci.quantity,
                total_price=line_total,
                status="Placed",
            )
            created_orders.append(o.order_id)

        # Clear cart
        Cart.objects.filter(user=user).delete()

    return Response({"message": "Checkout complete", "order_ids": created_orders, "total_price": total_price}, status=200)

