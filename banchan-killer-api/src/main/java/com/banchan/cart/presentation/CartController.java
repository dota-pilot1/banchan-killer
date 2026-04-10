package com.banchan.cart.presentation;

import com.banchan.cart.application.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItemResponse> getMyCart(Authentication authentication) {
        return cartService.getMyCart(authentication);
    }

    @PostMapping
    public CartItemResponse addItem(Authentication authentication,
                                    @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(authentication, request);
    }

    @PatchMapping("/{cartItemId}")
    public CartItemResponse updateQuantity(Authentication authentication,
                                           @PathVariable Long cartItemId,
                                           @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateQuantity(authentication, cartItemId, request);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeItem(Authentication authentication,
                                           @PathVariable Long cartItemId) {
        cartService.removeItem(authentication, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/products")
    public ResponseEntity<Void> removeByProductIds(Authentication authentication,
                                                   @RequestBody List<Long> productIds) {
        cartService.removeByProductIds(authentication, productIds);
        return ResponseEntity.noContent().build();
    }
}
