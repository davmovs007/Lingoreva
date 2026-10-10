package com.lingoreva.dto;

import jakarta.validation.constraints.Pattern;

public class RegisterRequest extends AuthRequest {
    @Override
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9\\s]).{8,}$",
        message = "Password must be at least 8 characters and include an uppercase letter, a number, and a special character"
    )
    public String getPassword() {
        return super.getPassword();
    }
}
