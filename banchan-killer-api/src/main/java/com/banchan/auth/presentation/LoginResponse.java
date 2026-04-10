package com.banchan.auth.presentation;

public record LoginResponse(
    Long id,
    String email,
    String nickname,
    String role,
    String accessToken // For now, we'll return a dummy or real JWT later
) {}
