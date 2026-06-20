package com.sujay.JwtAuthApp.payload.request;

// ==============================
// FILE: LoginRequest.java
// ==============================

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}


// ==============================
// FILE: SignupRequest.java
// ==============================
// package com.sujay.jwtauthapp.payload.request;
//
// import jakarta.validation.constraints.*;
// import lombok.Data;
// import java.util.Set;
//
// @Data
// public class SignupRequest {
//
//     @NotBlank @Size(min = 3, max = 50)
//     private String username;
//
//     @NotBlank @Size(max = 100) @Email
//     private String email;
//
//     private Set<String> role;
//
//     @NotBlank @Size(min = 6, max = 40)
//     private String password;
// }


// ==============================
// FILE: JwtResponse.java (response DTO)
// ==============================
// package com.sujay.jwtauthapp.payload.response;
//
// import lombok.Data;
// import java.util.List;
//
// @Data
// public class JwtResponse {
//     private String token;
//     private String type = "Bearer";
//     private Long id;
//     private String username;
//     private String email;
//     private List<String> roles;
//
//     public JwtResponse(String accessToken, Long id, String username,
//                        String email, List<String> roles) {
//         this.token = accessToken;
//         this.id = id;
//         this.username = username;
//         this.email = email;
//         this.roles = roles;
//     }
// }


// ==============================
// FILE: MessageResponse.java
// ==============================
// package com.sujay.jwtauthapp.payload.response;
// import lombok.AllArgsConstructor;
// import lombok.Data;
//
// @Data
// @AllArgsConstructor
// public class MessageResponse {
//     private String message;
// }
