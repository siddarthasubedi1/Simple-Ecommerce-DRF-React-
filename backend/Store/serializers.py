from rest_framework import serializers
from .models import Product, Category, Cart, CartItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    # Keep nested representation for reads, but accept a PK for writes
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Product
        # include the write-only `category_id` so clients can set the category
        fields = "__all__"

    # Field-level validation (e.g., for the 'price' field)
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    # Object-level validation (e.g., comparing two fields)
    def validate(self, data):
        if data["name"] == data["description"]:
            raise serializers.ValidationError(
                "Name and description cannot be identical."
            )
        return data

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)
    product_description = serializers.CharField(source="product.description", read_only=True)
    class Meta:
        model = CartItem
        fields = "__all__"

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source="cart_items", many=True, read_only=True)
    total = serializers.ReadOnlyField()
    class Meta:
        model = Cart
        fields = "__all__"
