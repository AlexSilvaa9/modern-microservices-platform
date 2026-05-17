package com.microservices.core.common.security;

import com.microservices.core.common.security.jwt.JwtAuthenticationProvider;
import com.microservices.core.common.security.jwt.JwtHttpOnlyCookieFilter;
import com.microservices.core.common.security.properties.SecurityProperties;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;
import java.util.Optional;

/**
 * Global security configuration for the application.
 * Enables JWT-based authentication filter and disables session management
 * to ensure a stateless, stateless security architecture.
 */
@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Properties containing security configuration such as whitelisted endpoints.
     */
    private final SecurityProperties securityProperties;

    /**
     * Provider responsible for validating JWT tokens.
     */
    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    /**
     * Constructs a new SecurityConfig with the required dependencies.
     *
     * @param securityProperties        the security configuration properties
     * @param jwtAuthenticationProvider the JWT authentication provider
     */
    public SecurityConfig(SecurityProperties securityProperties, JwtAuthenticationProvider jwtAuthenticationProvider) {
        this.securityProperties = securityProperties;
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }

    /**
     * Configures the main security filter chain.
     * Disables CSRF, sets stateless sessions, configures CORS, allows whitelisted endpoints,
     * and adds the JWT cookie filter before the standard authentication filter.
     *
     * @param http                     the HttpSecurity to modify
     * @param jwtHttpOnlyCookieFilter  the filter to extract and validate JWTs from cookies
     * @return the configured SecurityFilterChain
     * @throws Exception if an error occurs during configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtHttpOnlyCookieFilter jwtHttpOnlyCookieFilter) throws Exception {

        String[] whiteList = Optional.ofNullable(securityProperties.getWhitelist())
                .orElse(List.of())
                .toArray(new String[0]);

        log.info(">>>>>> Configurando whiteList: {}", (Object) whiteList);

        http
                .authenticationProvider(jwtAuthenticationProvider)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .cors(cors -> cors.configurationSource(request -> {
                    var configuration = new org.springframework.web.cors.CorsConfiguration();
                    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    configuration.setAllowedHeaders(List.of("*"));
                    configuration.setAllowCredentials(true); // Permitir cookies/autenticación
                    configuration.setAllowedOrigins(List.of("http://localhost:4200","http://localhost:8080"));

                    return configuration;
                }))
                .csrf(AbstractHttpConfigurer::disable)

                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(whiteList).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler((request, response, ex) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("Forbidden");
                        })
                );


        http.addFilterBefore(jwtHttpOnlyCookieFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    /**
     * Provides the AuthenticationManager bean used to authenticate requests.
     *
     * @param config the authentication configuration
     * @return the configured AuthenticationManager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        return config.getAuthenticationManager();
    }


    /**
     * Provides the PasswordEncoder bean used to hash and verify passwords.
     * Defaults to BCryptPasswordEncoder.
     *
     * @return the configured PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
