from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Product, Category, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# @api_view(["GET", "POST"])
# def category_list(request):
#     if request.method == "GET":
#         category = Category.objects.all()
#         serializer = CategorySerializer(category, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


#     serializer = CategorySerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.sava()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
def category_list(request):
    if request.method == "GET":
        category = Category.objects.all()
        # You correctly used many=True here because .all() returns a list
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        # 1. Added many=True here so it can handle your JSON list [...]
        serializer = CategorySerializer(
            data=request.data, many=isinstance(request.data, list)
        )

        if serializer.is_valid():
            # 2. Fixed typo: .sava() changed to .save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT", "DELETE"])
def category_update(request, pk):
    category = get_object_or_404(Category, pk=pk)

    if request.method == "GET":
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "DELETE":
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    if request.method == "PUT":
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
def product_list(request):
    if request.method == "GET":
        product = Product.objects.all()
        serializer = ProductSerializer(product, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT", "DELETE"])
def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == "GET":
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "DELETE":
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    if request.method == "PUT":
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=None)  # You can replace None with request.user if you have authentication set up
    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


# @api_view(["POST"])
# def add_to_cart(request):
#     product_id = request.data.get("product_id")
#     product = Product.objects.get(id=product_id)
#     quantity = request.data.get("quantity", 1)
#     cart, created = Cart.objects.get_or_create(user=None)  # You can replace None with request.user if you have authentication set up
#     item, created = CartItem.objects.get_or_create(cart=cart, product=product) 
#     if not created:
#         item.quantity += quantity
#         item.save()
#     return Response({"message": "Product added to cart"}, status=status.HTTP_200_OK)   





@api_view(["POST"])
def add_to_cart(request):
    product_id = request.data.get("product_id")

    # 1. Use get_object_or_404 to prevent the 500 crash
    # This will return a clean 404 response if the ID is wrong
    product = get_object_or_404(Product, id=product_id)

    quantity = int(request.data.get("quantity", 1))

    # Note: If using authentication later, use request.user
    cart, created = Cart.objects.get_or_create(user=None)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        item.quantity += quantity
    else:
        # If it's a new item, ensure the initial quantity is set correctly
        item.quantity = quantity
    item.save()

    return Response({"message": "Product added to cart"}, status=status.HTTP_200_OK)

    # serializer = CartItemSerializer(data=request.data)
    # if serializer.is_valid():
    #     serializer.save(cart=cart)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def update_from_cart( request):
    item_id = request.data.get("item_id")
    quantity = request.data.get("quantity")
    
    if item_id is None or quantity is None:
        return Response({"error": "item_id and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        item = CartItem.objects.get(id=item_id)
        if int(quantity) < 1:
            item.delete()  # Remove the item if quantity is less than 1
            return Response({"error": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)         
        
        item.quantity = quantity
        item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)      
       
    except CartItem.DoesNotExist:
        return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
@api_view(["POST"])
def remove_from_cart(request):
    item_id = request.data.get("item_id")
    CartItem.objects.filter(id=item_id).delete()
    return Response({"message": "Product removed from cart"}, status=status.HTTP_200_OK)        
    # product_id = request.data.get("product_id")
    # product = Product.objects.get(id=product_id)
    # cart, created = Cart.objects.get_or_create(user=None)  # You can replace None with request.user if you have authentication set up
    # item = CartItem.objects.filter(cart=cart, product=product).first()
    # if item:
    #     item.delete()
    #     return Response({"message": "Product removed from cart"}, status=status.HTTP_200_OK)
    # return Response({"error": "Product not found in cart"}, status=status.HTTP_404_NOT_FOUND)



@api_view(["POST"])
def create_cart(request):
    try:
        data = request.data
        name = data.get("name")
        address = data.get("address")
        phone = data.get("phone")
        payment_method = data.get("payment_method", 'COD')
        
        cart = Cart.objects.first()
        if not cart or not cart.cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        total = sum(float(item.product.price) * item.quantity for item in cart.cart_items.all())
        
        # createing order
        order = Order.objects.create(
            user=None,  # Replace with request.user if you have authentication
            total_price=total,
        )
        
        # createing order items
        for item in cart.cart_items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
                            )
        
        # Clear the cart after creating the order
        cart.cart_items.all().delete()
        
        return Response({"message": "Order created successfully",
                         "order_id": order.id
                         }, status=status.HTTP_201_CREATED)      
    except Exception as e:
        return Response({"error": str(e)}, status=status.Http_500_INTERNAL_SERVER_ERROR)