package com.banchan.order.infrastructure;

import com.banchan.order.domain.Order;
import com.banchan.order.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemJpaRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderOrderByCreatedAtAsc(Order order);
}
