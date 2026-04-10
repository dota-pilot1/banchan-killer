package com.banchan.order.domain;

import com.banchan.common.entity.BaseEntity;
import com.banchan.user.domain.User;
import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 50)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status;

    @Column(nullable = false, length = 50)
    private String ordererName;

    @Column(nullable = false, length = 20)
    private String ordererPhone;

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
    private Integer itemsAmount;

    @Column(nullable = false)
    private Integer deliveryFee;

    @Column(nullable = false)
    private Integer discountAmount;

    @Column(nullable = false)
    private Integer totalAmount;

    protected Order() {
    }

    public Order(User user, String orderNumber, String ordererName, String ordererPhone,
                 String recipientName, String recipientPhone, String zipCode,
                 String address1, String address2, String deliveryRequest,
                 Integer itemsAmount, Integer deliveryFee, Integer discountAmount, Integer totalAmount) {
        this.user = user;
        this.orderNumber = orderNumber;
        this.status = OrderStatus.PENDING_PAYMENT;
        this.ordererName = ordererName;
        this.ordererPhone = ordererPhone;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.zipCode = zipCode;
        this.address1 = address1;
        this.address2 = address2;
        this.deliveryRequest = deliveryRequest;
        this.itemsAmount = itemsAmount;
        this.deliveryFee = deliveryFee;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
    }

    public User getUser() {
        return user;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public String getOrdererName() {
        return ordererName;
    }

    public String getOrdererPhone() {
        return ordererPhone;
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

    public Integer getItemsAmount() {
        return itemsAmount;
    }

    public Integer getDeliveryFee() {
        return deliveryFee;
    }

    public Integer getDiscountAmount() {
        return discountAmount;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }
}
