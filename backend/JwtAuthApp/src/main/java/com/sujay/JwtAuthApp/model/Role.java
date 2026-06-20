package com.sujay.JwtAuthApp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

// ==============================
// ERole Enum — defines available roles
// ==============================
// Put this in a separate file: ERole.java
// public enum ERole { ROLE_USER, ROLE_MODERATOR, ROLE_ADMIN }

// ==============================
// Role Entity — maps to `roles` table in MySQL
// ==============================
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    public Role(ERole name) {
        this.name = name;
    }
}