package com.banchan.auth.presentation;

public record SignupResponse(
    Long id,
    String email,
    String nickname,
    String role
) {}
