package com.sujay.JwtAuthApp.security;

import com.sujay.JwtAuthApp.model.ERole;
import com.sujay.JwtAuthApp.model.Role;
import com.sujay.JwtAuthApp.repository.RoleRepository;
import com.sujay.JwtAuthApp.security.jwt.AuthEntryPointJwt;
import com.sujay.JwtAuthApp.security.jwt.AuthTokenFilter;
import com.sujay.JwtAuthApp.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// ==============================
// WebSecurityConfig
// Core security configuration:
// - Stateless JWT sessions (no cookies/HttpSession)
// - Public routes: /api/auth/**
// - Protected routes: /api/test/**
// - CORS allowed for React frontend on localhost:3000
// ==============================
@Configuration
@EnableMethodSecurity  // Enables @PreAuthorize, @Secured on controllers
public class WebSecurityConfig {

    UserDetailsServiceImpl userDetailsService;

    public WebSecurityConfig(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    // Register the JWT filter bean
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    // Use DaoAuthenticationProvider with BCrypt password encoder
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider(userDetailsService); // pass it here
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    // Expose AuthenticationManager bean (needed in AuthController)
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) {
        return authConfig.getAuthenticationManager();
    }

    // BCrypt for password hashing (strength 10 by default)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ==============================
    // Main Security Filter Chain
    // ==============================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (we're using JWT, not sessions)
                .csrf(csrf -> csrf.disable())

                // Enable CORS with our config below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Handle unauthorized access with custom JSON response
                .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))

                // STATELESS — no HttpSession created or used
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Define which routes are public and which require auth
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,"/api/auth/**").permitAll()      // Login/Register: open
                        .requestMatchers("/api/test/public").permitAll()  // Public test endpoint
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()                     // Everything else: needs JWT
                );

        // Register our custom auth provider
        http.authenticationProvider(authenticationProvider());

        // Add JWT filter BEFORE Spring's default UsernamePasswordAuthenticationFilter
        http.addFilterBefore(authenticationJwtTokenFilter(),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ==============================
    // CORS Configuration
    // Allows React app at localhost:3000 to call our API
    // ==============================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(ERole.ROLE_USER));
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
                roleRepository.save(new Role(ERole.ROLE_MODERATOR));
            }
        };
    }
}
