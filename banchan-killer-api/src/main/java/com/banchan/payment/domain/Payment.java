package com.banchan.payment.domain;

import com.banchan.common.entity.BaseEntity;
import com.banchan.order.domain.Order;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, unique = true, length = 200)
    private String paymentKey;

    @Column(length = 30)
    private String method;

    @Column(nullable = false)
    private Integer totalAmount;

    @Column(nullable = false, length = 30)
    private String status;

    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;

    @Column(length = 500)
    private String receiptUrl;

    protected Payment() {
    }

    public Payment(Order order, String paymentKey, String method, Integer totalAmount,
                   String status, LocalDateTime requestedAt, LocalDateTime approvedAt, String receiptUrl) {
        this.order = order;
        this.paymentKey = paymentKey;
        this.method = method;
        this.totalAmount = totalAmount;
        this.status = status;
        this.requestedAt = requestedAt;
        this.approvedAt = approvedAt;
        this.receiptUrl = receiptUrl;
    }

    public Order getOrder() { return order; }
    public String getPaymentKey() { return paymentKey; }
    public String getMethod() { return method; }
    public Integer getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public String getReceiptUrl() { return receiptUrl; }
}
