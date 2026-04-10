package com.banchan.payment.presentation;

import com.banchan.payment.application.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
