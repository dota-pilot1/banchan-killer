package com.banchan.payment.presentation;

import com.banchan.payment.application.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<PaymentResponse> confirmPayment(@RequestBody @Valid PaymentConfirmRequest request) {
        PaymentResponse response = paymentService.confirmPayment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<PaymentDetailResponse> getMyPayments(Authentication authentication) {
        return paymentService.getMyPayments(authentication);
    }

    @GetMapping("/{paymentId}")
    public PaymentDetailResponse getPaymentDetail(Authentication authentication, @PathVariable Long paymentId) {
        return paymentService.getPaymentDetail(authentication, paymentId);
    }
}
