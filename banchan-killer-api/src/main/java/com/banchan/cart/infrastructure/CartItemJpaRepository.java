package com.banchan.cart.infrastructure;

import com.banchan.cart.domain.CartItem;
import com.banchan.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemJpaRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserOrderByCreatedAtDesc(User user);

    Optional<CartItem> findByUserAndProductId(User user, Long productId);

    Optional<CartItem> findByIdAndUser(Long id, User user);

    void deleteByUser(User user);

    void deleteByUserAndProductIdIn(User user, List<Long> productIds);
}
