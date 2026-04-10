package com.banchan.user.presentation;

import com.banchan.user.domain.User;

public record MyProfileResponse(
        Long id,
        String email,
        String nickname,
        String phone,
        String profileImageUrl,
        String role
) {
    public static MyProfileResponse from(User user) {
        return new MyProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getPhone(),
                user.getProfileImageUrl(),
                user.getRole().name()
        );
    }
}
