package com.banchan.product.presentation;

import com.banchan.product.domain.ProductCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
    @NotBlank(message = "Product name is required")
    String name,

    @NotBlank(message = "Description is required")
    String description,

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    Integer price,

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    Integer stockQuantity,

    @NotNull(message = "Category is required")
    ProductCategory category,

    String imageUrl
) {}
