package com.banchan.user.presentation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserAddressRequest(
        @NotBlank @Size(max = 50) String recipientName,
        @NotBlank @Size(max = 20) String recipientPhone,
        @Size(max = 10) String zipCode,
        @NotBlank @Size(max = 255) String address1,
        @Size(max = 255) String address2,
        @Size(max = 255) String deliveryRequest,
        boolean isDefault
) {
}
