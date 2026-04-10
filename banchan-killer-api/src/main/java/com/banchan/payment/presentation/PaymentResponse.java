package com.banchan.payment.presentation;

import com.banchan.payment.domain.Payment;

import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long orderId,
        String paymentKey,
        String method,
        Integer totalAmount,
        String status,
        LocalDateTime approvedAt,
        String receiptUrl
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getPaymentKey(),
                payment.getMethod(),
                payment.getTotalAmount(),
                payment.getStatus(),
                payment.getApprovedAt(),
                payment.getReceiptUrl()
        );
    }
}
