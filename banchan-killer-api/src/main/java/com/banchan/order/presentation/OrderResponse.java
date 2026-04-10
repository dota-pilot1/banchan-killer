package com.banchan.order.presentation;

import com.banchan.order.domain.Order;

import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        String status,
        String ordererName,
        String ordererPhone,
        String recipientName,
        String recipientPhone,
        String zipCode,
        String address1,
        String address2,
        String deliveryRequest,
        Integer itemsAmount,
        Integer deliveryFee,
        Integer discountAmount,
        Integer totalAmount,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order order, List<OrderItemResponse> items) {
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getStatus().name(),
                order.getOrdererName(),
                order.getOrdererPhone(),
                order.getRecipientName(),
                order.getRecipientPhone(),
                order.getZipCode(),
                order.getAddress1(),
                order.getAddress2(),
                order.getDeliveryRequest(),
                order.getItemsAmount(),
                order.getDeliveryFee(),
                order.getDiscountAmount(),
                order.getTotalAmount(),
                items
        );
    }
}
