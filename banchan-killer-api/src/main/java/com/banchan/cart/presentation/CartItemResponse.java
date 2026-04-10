package com.banchan.cart.presentation;

import com.banchan.cart.domain.CartItem;
import com.banchan.product.domain.Product;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String description,
        Integer price,
        String imageUrl,
        String category,
        String status,
        Integer stockQuantity,
        Integer quantity
) {
    public static CartItemResponse from(CartItem cartItem) {
        Product product = cartItem.getProduct();
        return new CartItemResponse(
                cartItem.getId(),
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategory().name(),
                product.getStatus().name(),
                product.getStockQuantity(),
                cartItem.getQuantity()
        );
    }
}
