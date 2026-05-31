from django.urls import path
from . import views

urlpatterns = [
    path("product/", views.product_list, name="product-list"),
    path("product", views.product_list, name="product-list-no-slash"),
    path("product/<int:pk>/", views.product_update, name="product-update"),
    path("product/<int:pk>", views.product_update, name="product-update-no-slash"),
    path("category/", views.category_list, name="category-list"),
    # path("category/<int:pk>/", views.category_update, name="category_update"),
    path("category/<int:pk>", views.category_update, name="category_update_no_slash"),
    
    # Cart endpoints
    path("cart/", views.get_cart, name="cart-detail"),
    path("cart", views.get_cart, name="cart-detail-no-slash"),
    path("cart/add/", views.add_to_cart, name="add-to-cart"),
    path("cart/add", views.add_to_cart, name="add-to-cart-no-slash"),
    path("cart/remove/", views.remove_from_cart, name="remove-from-cart"),
    path("cart/remove", views.remove_from_cart, name="remove-from-cart-no-slash"),   
    path('cart/update/', views.update_from_cart, name='update-quantity'),
    path('cart/update', views.update_from_cart, name='update-quantity-no-slash'),
    path('orders/create/', views.create_cart, name='create-cart'),
    path('orders/create', views.create_cart, name='create-cart-no-slash'),
]
