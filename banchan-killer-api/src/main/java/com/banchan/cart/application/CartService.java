package com.banchan.cart.application;

import com.banchan.cart.domain.CartItem;
import com.banchan.cart.infrastructure.CartItemJpaRepository;
import com.banchan.cart.presentation.AddCartItemRequest;
import com.banchan.cart.presentation.CartItemResponse;
import com.banchan.cart.presentation.UpdateCartItemRequest;
import com.banchan.product.domain.Product;
import com.banchan.product.domain.ProductRepository;
import com.banchan.user.domain.User;
import com.banchan.user.domain.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CartService {

    private final CartItemJpaRepository cartItemJpaRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemJpaRepository cartItemJpaRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemJpaRepository = cartItemJpaRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<CartItemResponse> getMyCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return cartItemJpaRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(CartItemResponse::from)
                .toList();
    }

    @Transactional
    public CartItemResponse addItem(Authentication authentication, AddCartItemRequest request) {
        User user = getCurrentUser(authentication);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // 이미 장바구니에 있으면 수량 증가
        var existing = cartItemJpaRepository.findByUserAndProductId(user, product.getId());
        if (existing.isPresent()) {
            CartItem cartItem = existing.get();
            cartItem.addQuantity(request.quantity());
            return CartItemResponse.from(cartItem);
        }

        CartItem cartItem = new CartItem(user, product, request.quantity());
        cartItemJpaRepository.save(cartItem);
        return CartItemResponse.from(cartItem);
    }

    @Transactional
    public CartItemResponse updateQuantity(Authentication authentication, Long cartItemId, UpdateCartItemRequest request) {
        User user = getCurrentUser(authentication);
        CartItem cartItem = cartItemJpaRepository.findByIdAndUser(cartItemId, user)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다."));
        cartItem.updateQuantity(request.quantity());
        return CartItemResponse.from(cartItem);
    }

    @Transactional
    public void removeItem(Authentication authentication, Long cartItemId) {
        User user = getCurrentUser(authentication);
        CartItem cartItem = cartItemJpaRepository.findByIdAndUser(cartItemId, user)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다."));
        cartItemJpaRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        cartItemJpaRepository.deleteByUser(user);
    }

    @Transactional
    public void removeByProductIds(Authentication authentication, List<Long> productIds) {
        User user = getCurrentUser(authentication);
        cartItemJpaRepository.deleteByUserAndProductIdIn(user, productIds);
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
}
