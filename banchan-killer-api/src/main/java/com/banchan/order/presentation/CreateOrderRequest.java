package com.banchan.order.presentation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateOrderRequest(
        @NotBlank @Size(max = 50) String ordererName,
        @NotBlank @Size(max = 20) String ordererPhone,
        @NotBlank @Size(max = 50) String recipientName,
        @NotBlank @Size(max = 20) String recipientPhone,
        @Size(max = 10) String zipCode,
        @NotBlank @Size(max = 255) String address1,
        @Size(max = 255) String address2,
        @Size(max = 255) String deliveryRequest,
        Integer deliveryFee,
        Integer discountAmount,
        @Valid @NotEmpty List<OrderProductRequest> items
) {
    public record OrderProductRequest(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity
    ) {
    }
}
