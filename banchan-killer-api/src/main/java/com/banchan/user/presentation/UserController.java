package com.banchan.user.presentation;

import com.banchan.user.application.UserProfileService;
import com.banchan.user.domain.User;
import com.banchan.user.domain.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final UserProfileService userProfileService;

    public UserController(UserRepository userRepository, UserProfileService userProfileService) {
        this.userRepository = userRepository;
        this.userProfileService = userProfileService;
    }

    @GetMapping("/admin/users")
    public List<AdminUserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserSummaryResponse::from)
                .toList();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users/health")
    public ResponseEntity<String> health() {
        long count = userRepository.count();
        return ResponseEntity.ok("Database connected! User count: " + count);
    }

    @GetMapping("/users/me")
    public MyProfileResponse getMyProfile(Authentication authentication) {
        return userProfileService.getMyProfile(authentication);
    }

    @PatchMapping("/users/me")
    public MyProfileResponse updateMyProfile(Authentication authentication,
                                             @Valid @RequestBody UpdateMyProfileRequest request) {
        return userProfileService.updateMyProfile(authentication, request);
    }

    @GetMapping("/users/me/addresses")
    public List<UserAddressResponse> getMyAddresses(Authentication authentication) {
        return userProfileService.getMyAddresses(authentication);
    }

    @PostMapping("/users/me/addresses")
    public UserAddressResponse createAddress(Authentication authentication,
                                            @Valid @RequestBody UserAddressRequest request) {
        return userProfileService.createAddress(authentication, request);
    }

    @PatchMapping("/users/me/addresses/{addressId}")
    public UserAddressResponse updateAddress(Authentication authentication,
                                            @PathVariable Long addressId,
                                            @Valid @RequestBody UserAddressRequest request) {
        return userProfileService.updateAddress(authentication, addressId, request);
    }

    @PatchMapping("/users/me/addresses/{addressId}/default")
    public UserAddressResponse setDefaultAddress(Authentication authentication, @PathVariable Long addressId) {
        return userProfileService.setDefaultAddress(authentication, addressId);
    }

    @DeleteMapping("/users/me/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication, @PathVariable Long addressId) {
        userProfileService.deleteAddress(authentication, addressId);
        return ResponseEntity.noContent().build();
    }
}
