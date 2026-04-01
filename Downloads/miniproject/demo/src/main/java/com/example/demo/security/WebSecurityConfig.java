package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("=== Building Security Filter Chain ===");
        
        http.csrf(csrf -> {
            csrf.disable();
            System.out.println("CSRF disabled");
        })
        .cors(cors -> cors.configurationSource(request -> {
            var corsConfig = new org.springframework.web.cors.CorsConfiguration();
            corsConfig.addAllowedOrigin("http://localhost:3000");
            corsConfig.addAllowedOrigin("http://localhost:3001");
            corsConfig.addAllowedOrigin("http://localhost:3002");
            corsConfig.addAllowedMethod("*");
            corsConfig.addAllowedHeader("*");
            corsConfig.setAllowCredentials(true);
            System.out.println("CORS configured for localhost:3000 and localhost:3001");
            return corsConfig;
        }))
        .authorizeHttpRequests(authz -> {
            authz
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()
                .requestMatchers("/api/applications/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated();

            System.out.println("Authorization configured: /api/auth/** and GET /api/jobs permitted, everything else requires auth");
        })
        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        System.out.println("JWT Filter added before UsernamePasswordAuthenticationFilter");

        return http.build();
    }
}
