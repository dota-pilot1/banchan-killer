package com.banchan.user.presentation;

import jakarta.validation.constraints.Size;

public record UpdateMyProfileRequest(
        @Size(max = 50) String nickname,
        @Size(max = 20) String phone,
        @Size(max = 500) String profileImageUrl
) {
}
