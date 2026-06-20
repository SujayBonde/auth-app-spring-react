package com.sujay.JwtAuthApp.payload.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Set;

// ==============================
// SignupRequest — body of POST /api/auth/signup
// ==============================
@Data
public class SignupRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    // Optional — defaults to ROLE_USER if not provided
    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}
