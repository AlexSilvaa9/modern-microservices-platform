package com.microservices.user.service;

import com.microservices.core.common.dto.enums.IdentityProvider;
import com.microservices.core.common.dto.enums.Role;
import com.microservices.core.common.security.jwt.JwtService;
import com.microservices.user.dto.AuthDTO;
import com.microservices.user.mapper.UserMapper;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.model.UserEntity;
import com.microservices.user.repository.UserRepository;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service managing Google OAuth2 authentication flow.
 * Handles exchanging authorization codes for tokens and upserting users based on Google data.
 */
@Service
@Slf4j
@Transactional
@ConditionalOnProperty(name = "user-management.google.enable", havingValue = "true")
public class GoogleAuthService {

    /** Google Client ID retrieved from configuration. */
    @Value("${google.client-id}")
    private String clientId;

    /** Google Client Secret retrieved from configuration. */
    @Value("${google.client-secret}")
    private String clientSecret;

    /** Allowed redirect URI registered with Google. */
    @Value("${google.redirect-uri}")
    private String redirectUri;

    /** Repository for direct database access of users. */
    private final UserRepository userRepository;
    /** Service for general user operations. */
    private final UserService userService;
    private final UserMapper userMapper;
    /** Service for internal JWT generation. */
    private final JwtService jwtService;
    /** Standard Spring RestTemplate for synchronous HTTP requests. */
    private final RestTemplate restTemplate = new RestTemplate();
    /** Service managing refresh tokens. */
    private final RefreshTokenService refreshTokenService;
    /** Kafka producer template for triggering asynchronous emails. */
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Constructs a new GoogleAuthService.
     *
     * @param userRepository      the user repository
     * @param userService         the user service
     * @param jwtService          the internal JWT service
     * @param refreshTokenService the internal refresh token service
     * @param kafkaTemplate       the Kafka template for asynchronous messaging
     */
    public GoogleAuthService(UserRepository userRepository, UserService userService, UserMapper userMapper,
                             JwtService jwtService, RefreshTokenService refreshTokenService, KafkaTemplate<String, Object> kafkaTemplate) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Orchestrates the Google login flow: exchanges the code, fetches user info,
     * registers/updates the user, and issues internal JWTs.
     *
     * @param code the short-lived authorization code from Google
     * @return an AuthDTO containing the generated internal tokens
     */
    @Transactional
    public AuthDTO handleGoogleLogin(String code) {

        String accessToken = getAccessToken(code);

        Map<String, Object> userInfo = getUserInfo(accessToken);

        String email = Optional.ofNullable(userInfo)
                .map(map -> map.get("email"))
                .map(Object::toString)
                .orElseThrow(() ->
                        new IllegalStateException("Email not found in user info"));

        UserEntity user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setEmail(email);
                    newUser.setProviders(List.of(IdentityProvider.GOOGLE));
                    newUser.setRoles(List.of(Role.USER));
                    newUser.setCreatedAt(LocalDateTime.now());
                    newUser.setUsername(email);
                    kafkaTemplate.send("user-created-topic",userMapper.toDTO(newUser));

                    return userRepository.save(newUser);
                });
        if (!user.getProviders().contains(IdentityProvider.GOOGLE)){
            userService.addProvider(user.getEmail(), IdentityProvider.GOOGLE);
        }
        // 4. JWT
        String token = jwtService.generateToken(user.getEmail(), user.getRoles());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        return AuthDTO.builder()
                .token(token)
                .refreshToken(refreshToken)
                .build();

    }

    /**
     * Exchanges the authorization code for a Google access token using the token endpoint.
     *
     * @param code the authorization code
     * @return the extracted Google access token
     */
    private @NotNull String getAccessToken(String code) {

        String url = "https://oauth2.googleapis.com/token";

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> request = new HttpEntity<>(body, headers);

        Map<String, Object> response = restTemplate.postForObject(
                url,
                request,
                Map.class
        );
        return Optional.ofNullable(response)
                .filter(map -> !map.isEmpty())
                .map(map -> map.get("access_token"))
                .map(Object::toString)
                .orElseThrow(() ->
                        new IllegalStateException("Access token not found"));
    }

    /**
     * Fetches user profile details from Google's UserInfo endpoint using the access token.
     *
     * @param token the Google access token
     * @return a map containing the parsed user information attributes
     */
    private @Nullable Map<String, Object> getUserInfo(String token) {

        String url = "https://openidconnect.googleapis.com/v1/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                Map.class
        );

        return response.getBody();
    }

}