package com.banchan.auth.presentation;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(example = "terecal@daum.net")
    String email,
    
    @NotBlank(message = "Password is required")
    @Schema(example = "hyun0316!@")
    String password
) {}
