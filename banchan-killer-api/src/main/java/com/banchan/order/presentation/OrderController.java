package com.banchan.order.presentation;

import com.banchan.order.application.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse createOrder(Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(authentication, request);
    }

    @GetMapping
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        return orderService.getMyOrders(authentication);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getMyOrder(Authentication authentication, @PathVariable Long orderId) {
        return orderService.getMyOrder(authentication, orderId);
    }
}
