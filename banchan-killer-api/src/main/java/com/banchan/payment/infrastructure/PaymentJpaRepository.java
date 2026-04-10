package com.banchan.payment.infrastructure;

import com.banchan.payment.domain.Payment;
import com.banchan.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PaymentJpaRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentKey(String paymentKey);
    Optional<Payment> findByOrderId(Long orderId);

    @Query("SELECT p FROM Payment p WHERE p.order.user = :user ORDER BY p.createdAt DESC")
    List<Payment> findByOrderUserOrderByCreatedAtDesc(User user);
}
