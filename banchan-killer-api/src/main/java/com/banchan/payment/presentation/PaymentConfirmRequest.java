package com.banchan.payment.presentation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentConfirmRequest(
        @NotBlank String paymentKey,
        @NotBlank String orderId,
        @NotNull @Positive Integer amount
) {
}
