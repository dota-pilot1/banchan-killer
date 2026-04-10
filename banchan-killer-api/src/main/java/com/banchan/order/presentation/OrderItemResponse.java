package com.banchan.order.presentation;

import com.banchan.order.domain.OrderItem;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        String productImageUrl,
        String productCategory,
        Integer unitPrice,
        Integer quantity,
        Integer lineTotalAmount
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProductId(),
                item.getProductName(),
                item.getProductImageUrl(),
                item.getProductCategory(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotalAmount()
        );
    }
}
