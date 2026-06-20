package com.sujay.JwtAuthApp.repository;

import com.sujay.JwtAuthApp.model.ERole;
import com.sujay.JwtAuthApp.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}
