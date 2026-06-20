package com.sujay.JwtAuthApp.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// ==============================
// TestController
// Demonstrates role-based access control with @PreAuthorize
//
// GET /api/test/public      → Anyone (no token needed)
// GET /api/test/user        → Needs ROLE_USER, ROLE_MODERATOR, or ROLE_ADMIN
// GET /api/test/moderator   → Needs ROLE_MODERATOR
// GET /api/test/admin       → Needs ROLE_ADMIN
// ==============================
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String publicAccess() {
        return "Public Content — No authentication required.";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public String userAccess() {
        return "User Content — You are authenticated!";
    }

    @GetMapping("/moderator")
    @PreAuthorize("hasRole('MODERATOR')")
    public String moderatorAccess() {
        return "Moderator Board — You have moderator role.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Panel — You have admin privileges.";
    }
}
