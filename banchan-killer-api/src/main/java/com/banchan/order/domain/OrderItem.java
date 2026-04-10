package com.banchan.order.domain;

import com.banchan.common.entity.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false, length = 100)
    private String productName;

    @Column(length = 255)
    private String productImageUrl;

    @Column(nullable = false, length = 50)
    private String productCategory;

    @Column(nullable = false)
    private Integer unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer lineTotalAmount;

    protected OrderItem() {
    }

    public OrderItem(Order order, Long productId, String productName, String productImageUrl,
                     String productCategory, Integer unitPrice, Integer quantity, Integer lineTotalAmount) {
        this.order = order;
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.productCategory = productCategory;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotalAmount = lineTotalAmount;
    }

    public Order getOrder() {
        return order;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public Integer getUnitPrice() {
        return unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Integer getLineTotalAmount() {
        return lineTotalAmount;
    }
}
