from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product


def _parse_float(value: str | None):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return "invalid"


@api_view(["GET"])
def products_search(request):
    query = (request.query_params.get("query") or "").strip()
    category = (request.query_params.get("category") or "").strip()
    min_price = _parse_float(request.query_params.get("min_price"))
    max_price = _parse_float(request.query_params.get("max_price"))

    if min_price == "invalid":
        return Response({"error": "min_price must be a number"}, status=400)
    if max_price == "invalid":
        return Response({"error": "max_price must be a number"}, status=400)
    if min_price is not None and max_price is not None and min_price > max_price:
        return Response({"error": "min_price cannot be greater than max_price"}, status=400)

    qs = Product.objects.select_related("category").all()

    if query:
        qs = qs.filter(Q(name__icontains=query) | Q(description__icontains=query))

    if category:
        # Accept either numeric category_id or category name.
        if category.isdigit():
            qs = qs.filter(category_id=int(category))
        else:
            qs = qs.filter(category__cName=category)

    if min_price is not None:
        qs = qs.filter(price__gte=min_price)
    if max_price is not None:
        qs = qs.filter(price__lte=max_price)

    limit_raw = request.query_params.get("limit")
    offset_raw = request.query_params.get("offset")

    try:
        limit = int(limit_raw) if limit_raw not in (None, "") else 50
        offset = int(offset_raw) if offset_raw not in (None, "") else 0
    except ValueError:
        return Response({"error": "limit and offset must be integers"}, status=400)

    if limit < 1 or limit > 200:
        return Response({"error": "limit must be between 1 and 200"}, status=400)
    if offset < 0:
        return Response({"error": "offset must be >= 0"}, status=400)

    total = qs.count()
    results = qs.order_by("product_id")[offset : offset + limit]

    data = [
        {
            "product_id": p.product_id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "inventory": p.inventory,
            "img_val": p.img_val,
            "category": None if p.category is None else {"id": p.category_id, "name": p.category.cName},
        }
        for p in results
    ]

    return Response({"count": total, "results": data}, status=200)

