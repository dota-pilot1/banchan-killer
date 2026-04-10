package com.banchan.order.application;

import com.banchan.order.domain.Order;
import com.banchan.order.domain.OrderItem;
import com.banchan.order.infrastructure.OrderItemJpaRepository;
import com.banchan.order.infrastructure.OrderJpaRepository;
import com.banchan.order.presentation.CreateOrderRequest;
import com.banchan.order.presentation.CreateOrderRequest.OrderProductRequest;
import com.banchan.order.presentation.OrderItemResponse;
import com.banchan.order.presentation.OrderResponse;
import com.banchan.product.domain.Product;
import com.banchan.product.domain.ProductRepository;
import com.banchan.user.domain.User;
import com.banchan.user.domain.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderJpaRepository orderJpaRepository;
    private final OrderItemJpaRepository orderItemJpaRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderJpaRepository orderJpaRepository, OrderItemJpaRepository orderItemJpaRepository,
                        ProductRepository productRepository, UserRepository userRepository) {
        this.orderJpaRepository = orderJpaRepository;
        this.orderItemJpaRepository = orderItemJpaRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse createOrder(Authentication authentication, CreateOrderRequest request) {
        User user = getCurrentUser(authentication);

        int itemsAmount = 0;
        List<Product> products = request.items().stream()
                .map(item -> productRepository.findById(item.productId())
                        .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + item.productId())))
                .toList();

        for (int i = 0; i < request.items().size(); i++) {
            OrderProductRequest item = request.items().get(i);
            Product product = products.get(i);

            if (product.getStatus() != Product.ProductStatus.SALE) {
                throw new IllegalArgumentException("주문할 수 없는 상품이 포함되어 있습니다.");
            }
            if (product.getStockQuantity() < item.quantity()) {
                throw new IllegalArgumentException("재고가 부족한 상품이 있습니다.");
            }
            itemsAmount += product.getPrice() * item.quantity();
        }

        int deliveryFee = request.deliveryFee() != null ? request.deliveryFee() : 0;
        int discountAmount = request.discountAmount() != null ? request.discountAmount() : 0;
        int totalAmount = itemsAmount + deliveryFee - discountAmount;

        Order order = new Order(
                user,
                generateOrderNumber(user.getId()),
                request.ordererName(),
                request.ordererPhone(),
                request.recipientName(),
                request.recipientPhone(),
                request.zipCode(),
                request.address1(),
                request.address2(),
                request.deliveryRequest(),
                itemsAmount,
                deliveryFee,
                discountAmount,
                totalAmount
        );
        Order savedOrder = orderJpaRepository.save(order);

        for (int i = 0; i < request.items().size(); i++) {
            OrderProductRequest item = request.items().get(i);
            Product product = products.get(i);
            orderItemJpaRepository.save(new OrderItem(
                    savedOrder,
                    product.getId(),
                    product.getName(),
                    product.getImageUrl(),
                    product.getCategory().name(),
                    product.getPrice(),
                    item.quantity(),
                    product.getPrice() * item.quantity()
            ));
        }

        return mapOrder(savedOrder);
    }

    public List<OrderResponse> getMyOrders(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return orderJpaRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapOrder)
                .toList();
    }

    public OrderResponse getMyOrder(Authentication authentication, Long orderId) {
        User user = getCurrentUser(authentication);
        Order order = orderJpaRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        return mapOrder(order);
    }

    private OrderResponse mapOrder(Order order) {
        List<OrderItemResponse> itemResponses = orderItemJpaRepository.findByOrderOrderByCreatedAtAsc(order).stream()
                .map(OrderItemResponse::from)
                .toList();

        return OrderResponse.from(order, itemResponses);
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    private String generateOrderNumber(Long userId) {
        return "BK-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + "-" + userId;
    }
}
