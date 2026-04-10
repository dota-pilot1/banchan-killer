package com.banchan.payment.infrastructure;

import com.banchan.payment.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentJpaRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentKey(String paymentKey);
    Optional<Payment> findByOrderId(Long orderId);
}
