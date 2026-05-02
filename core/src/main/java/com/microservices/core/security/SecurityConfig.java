package com.microservices.core.security;

import com.microservices.core.security.jwt.JwtAuthenticationProvider;
import com.microservices.core.security.jwt.JwtHttpOnlyCookieFilter;
import com.microservices.core.security.properties.SecurityProperties;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;
import java.util.Optional;

/**
 * Configuración de seguridad: habilita JWT filter y desactiva sesiones.
 */
@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SecurityProperties securityProperties;
    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    public SecurityConfig(SecurityProperties securityProperties, JwtAuthenticationProvider jwtAuthenticationProvider) {
        this.securityProperties = securityProperties;
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                             JwtHttpOnlyCookieFilter jwtHttpOnlyCookieFilter){

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
                    configuration.setAllowedOrigins(List.of("*")); // Permitir cualquier origen
                    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    configuration.setAllowedHeaders(List.of("*"));
                    configuration.setAllowCredentials(true); // Permitir cookies/autenticación
                    configuration.setAllowedOrigins(List.of("http://localhost:4200"));

                    return configuration;
                }))
                .csrf(AbstractHttpConfigurer::disable)

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
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        return config.getAuthenticationManager();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
