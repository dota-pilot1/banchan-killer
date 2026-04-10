package com.banchan.cart.domain;

import com.banchan.common.entity.BaseEntity;
import com.banchan.product.domain.Product;
import com.banchan.user.domain.User;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_items", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "product_id"})
})
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    protected CartItem() {
    }

    public CartItem(User user, Product product, Integer quantity) {
        this.user = user;
        this.product = product;
        this.quantity = quantity;
    }

    public User getUser() { return user; }
    public Product getProduct() { return product; }
    public Integer getQuantity() { return quantity; }

    public void addQuantity(int amount) {
        this.quantity += amount;
    }

    public void updateQuantity(int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        this.quantity = quantity;
    }
}
