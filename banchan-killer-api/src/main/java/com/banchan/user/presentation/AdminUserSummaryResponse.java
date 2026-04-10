package com.banchan.user.presentation;

import com.banchan.user.domain.User;

import java.time.LocalDateTime;

public record AdminUserSummaryResponse(
    Long id,
    String email,
    String nickname,
    String role,
    Boolean enabled,
    LocalDateTime createdAt
) {
    public static AdminUserSummaryResponse from(User user) {
        return new AdminUserSummaryResponse(
            user.getId(),
            user.getEmail(),
            user.getNickname(),
            user.getRole().name(),
            user.getEnabled(),
            user.getCreatedAt()
        );
    }
}
