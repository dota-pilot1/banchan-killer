package com.banchan.user.presentation;

import com.banchan.user.domain.UserAddress;

public record UserAddressResponse(
        Long id,
        String recipientName,
        String recipientPhone,
        String zipCode,
        String address1,
        String address2,
        String deliveryRequest,
        boolean isDefault
) {
    public static UserAddressResponse from(UserAddress address) {
        return new UserAddressResponse(
                address.getId(),
                address.getRecipientName(),
                address.getRecipientPhone(),
                address.getZipCode(),
                address.getAddress1(),
                address.getAddress2(),
                address.getDeliveryRequest(),
                address.isDefault()
        );
    }
}
