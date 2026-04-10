package com.banchan.product.presentation;

import com.banchan.product.domain.Product;

public record ProductResponse(
    Long id,
    String name,
    String description,
    Integer price,
    Integer stockQuantity,
    String category,
    String imageUrl,
    String status
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getStockQuantity(),
            product.getCategory().name(),
            product.getImageUrl(),
            product.getStatus().name()
        );
    }
}
