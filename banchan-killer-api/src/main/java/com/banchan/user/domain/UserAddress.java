package com.banchan.user.domain;

import com.banchan.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "user_addresses")
public class UserAddress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String recipientName;

    @Column(nullable = false, length = 20)
    private String recipientPhone;

    @Column(length = 10)
    private String zipCode;

    @Column(nullable = false, length = 255)
    private String address1;

    @Column(length = 255)
    private String address2;

    @Column(length = 255)
    private String deliveryRequest;

    @Column(nullable = false)
    private boolean isDefault;

    protected UserAddress() {
    }

    public UserAddress(User user, String recipientName, String recipientPhone, String zipCode,
                       String address1, String address2, String deliveryRequest, boolean isDefault) {
        this.user = user;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.zipCode = zipCode;
        this.address1 = address1;
        this.address2 = address2;
        this.deliveryRequest = deliveryRequest;
        this.isDefault = isDefault;
    }

    public User getUser() {
        return user;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public String getZipCode() {
        return zipCode;
    }

    public String getAddress1() {
        return address1;
    }

    public String getAddress2() {
        return address2;
    }

    public String getDeliveryRequest() {
        return deliveryRequest;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void update(String recipientName, String recipientPhone, String zipCode,
                       String address1, String address2, String deliveryRequest) {
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.zipCode = zipCode;
        this.address1 = address1;
        this.address2 = address2;
        this.deliveryRequest = deliveryRequest;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }
}
