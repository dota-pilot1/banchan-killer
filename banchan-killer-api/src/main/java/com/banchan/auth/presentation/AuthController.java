package com.banchan.auth.presentation;

import com.banchan.auth.application.AuthService;
import com.banchan.auth.presentation.LoginRequest;
import com.banchan.auth.presentation.LoginResponse;
import com.banchan.auth.presentation.SignupRequest;
import com.banchan.auth.presentation.SignupResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "로그인 및 회원가입 API")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @Operation(summary = "회원 가입", description = "새로운 반찬 킬러 회원을 등록합니다.")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        // 1. authService.signup(request)  → 회원가입 로직 실행, SignupResponse 반환
        SignupResponse response = authService.signup(request);
        
        // 2. ResponseEntity.status(201).body(response)  → HTTP 201 + JSON 응답
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

}
