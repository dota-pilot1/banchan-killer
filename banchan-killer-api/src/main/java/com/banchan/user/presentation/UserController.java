package com.banchan.user.presentation;

import com.banchan.user.domain.User;
import com.banchan.user.domain.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
