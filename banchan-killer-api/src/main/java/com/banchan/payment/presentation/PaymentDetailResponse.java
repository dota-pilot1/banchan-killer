package com.banchan.payment.presentation;

import com.banchan.order.domain.Order;
import com.banchan.order.domain.OrderItem;
import com.banchan.payment.domain.Payment;

import java.time.LocalDateTime;
import java.util.List;

public record PaymentDetailResponse(
        Long id,
        String paymentKey,
        String method,
        Integer totalAmount,
        String status,
        LocalDateTime requestedAt,
        LocalDateTime approvedAt,
        String receiptUrl,
        // 주문 정보
        Long orderId,
        String orderNumber,
        String orderStatus,
        String ordererName,
        List<PaymentItemResponse> items
) {
    public record PaymentItemResponse(
            String productName,
            Integer unitPrice,
            Integer quantity,
            Integer lineTotalAmount
    ) {
    }

    public static PaymentDetailResponse from(Payment payment, List<OrderItem> orderItems) {
        Order order = payment.getOrder();
        return new PaymentDetailResponse(
                payment.getId(),
                payment.getPaymentKey(),
                payment.getMethod(),
                payment.getTotalAmount(),
                payment.getStatus(),
                payment.getRequestedAt(),
                payment.getApprovedAt(),
                payment.getReceiptUrl(),
                order.getId(),
                order.getOrderNumber(),
                order.getStatus().name(),
                order.getOrdererName(),
                orderItems.stream()
                        .map(item -> new PaymentItemResponse(
                                item.getProductName(),
                                item.getUnitPrice(),
                                item.getQuantity(),
                                item.getLineTotalAmount()
                        ))
                        .toList()
        );
    }
}
