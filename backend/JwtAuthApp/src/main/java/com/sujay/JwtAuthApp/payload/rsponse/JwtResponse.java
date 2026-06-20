package com.sujay.JwtAuthApp.payload.rsponse;

// ==============================
// FILE 1: JwtResponse.java
// ==============================

import lombok.Data;
import java.util.List;

// Returned on successful login
@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String username,
                       String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}


// ==============================
// FILE 2: MessageResponse.java
// Paste into its own file: MessageResponse.java
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
