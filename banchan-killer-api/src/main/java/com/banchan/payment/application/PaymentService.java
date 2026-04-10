package com.banchan.payment.application;

import com.banchan.order.domain.Order;
import com.banchan.order.domain.OrderStatus;
import com.banchan.order.infrastructure.OrderJpaRepository;
import com.banchan.payment.domain.Payment;
import com.banchan.payment.infrastructure.PaymentJpaRepository;
import com.banchan.payment.presentation.PaymentConfirmRequest;
import com.banchan.payment.presentation.PaymentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final OrderJpaRepository orderJpaRepository;
    private final PaymentJpaRepository paymentJpaRepository;
    private final RestClient tossRestClient;

    public PaymentService(
            OrderJpaRepository orderJpaRepository,
            PaymentJpaRepository paymentJpaRepository,
            @Value("${tosspayments.secret-key}") String secretKey
    ) {
        this.orderJpaRepository = orderJpaRepository;
        this.paymentJpaRepository = paymentJpaRepository;

        String encoded = Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        this.tossRestClient = RestClient.builder()
                .baseUrl("https://api.tosspayments.com/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic " + encoded)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * 결제 승인 처리
     *
     * 1. orderId(주문번호)로 주문 조회
     * 2. 금액 위변조 검증
     * 3. 중복 결제 방지
     * 4. 토스페이먼츠 승인 API 호출
     * 5. Payment 저장 + 주문 상태 변경
     */
    @Transactional
    public PaymentResponse confirmPayment(PaymentConfirmRequest request) {
        // 1. 주문 조회 (orderId = orderNumber)
        Order order = orderJpaRepository.findByOrderNumber(request.orderId())
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + request.orderId()));

        // 2. 금액 위변조 검증
        if (!order.getTotalAmount().equals(request.amount())) {
            log.warn("결제 금액 불일치: 주문={}, 요청={}", order.getTotalAmount(), request.amount());
            throw new IllegalArgumentException("결제 금액이 주문 금액과 일치하지 않습니다.");
        }

        // 3. 이미 결제된 주문인지 확인
        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("이미 결제 완료된 주문입니다.");
        }

        // 4. 중복 결제 방지 (같은 paymentKey로 이미 저장된 결제가 있는지)
        if (paymentJpaRepository.findByPaymentKey(request.paymentKey()).isPresent()) {
            throw new IllegalStateException("이미 처리된 결제입니다.");
        }

        // 5. 토스페이먼츠 승인 API 호출
        Map<String, Object> confirmBody = Map.of(
                "paymentKey", request.paymentKey(),
                "orderId", request.orderId(),
                "amount", request.amount()
        );

        Map<?, ?> tossResponse;
        try {
            tossResponse = tossRestClient.post()
                    .uri("/payments/confirm")
                    .body(confirmBody)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("토스 결제 승인 실패: {}", e.getMessage());
            order.markAsPaymentFailed();
            throw new RuntimeException("결제 승인에 실패했습니다: " + e.getMessage());
        }

        if (tossResponse == null) {
            order.markAsPaymentFailed();
            throw new RuntimeException("토스 결제 응답이 비어있습니다.");
        }

        // 6. Payment 저장
        String method = (String) tossResponse.get("method");
        String status = (String) tossResponse.get("status");
        String receiptUrl = null;
        Object receipt = tossResponse.get("receipt");
        if (receipt instanceof Map<?, ?> receiptMap) {
            receiptUrl = (String) receiptMap.get("url");
        }

        LocalDateTime requestedAt = parseDateTime(tossResponse.get("requestedAt"));
        LocalDateTime approvedAt = parseDateTime(tossResponse.get("approvedAt"));

        Payment payment = new Payment(
                order, request.paymentKey(), method, request.amount(),
                status, requestedAt, approvedAt, receiptUrl
        );
        paymentJpaRepository.save(payment);

        // 7. 주문 상태 변경
        order.markAsPaid();

        log.info("결제 완료: orderNumber={}, paymentKey={}, amount={}",
                order.getOrderNumber(), request.paymentKey(), request.amount());

        return PaymentResponse.from(payment);
    }

    private LocalDateTime parseDateTime(Object value) {
        if (value == null) return null;
        try {
            return OffsetDateTime.parse(value.toString()).toLocalDateTime();
        } catch (Exception e) {
            return null;
        }
    }
}
