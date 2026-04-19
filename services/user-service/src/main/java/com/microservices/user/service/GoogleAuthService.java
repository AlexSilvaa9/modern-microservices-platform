package com.microservices.user.service;

import com.microservices.core.dto.enums.IdentityProvider;
import com.microservices.core.dto.enums.Role;
import com.microservices.core.security.JwtService;
import com.microservices.user.dto.AuthDTO;
import com.microservices.user.mapper.UserMapper;
import com.microservices.user.model.RefreshToken;
import com.microservices.user.model.UserEntity;
import com.microservices.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GoogleAuthService {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final RefreshTokenService refreshTokenService;

    public GoogleAuthService(UserRepository userRepository, UserService userService,
                             JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public AuthDTO handleGoogleLogin(String code) {
        log.info("handleGoogleLogin called");
        // 1. Code → Access Token
        String accessToken = getAccessToken(code);

        // 2. UserInfo
        Map<String, Object> userInfo = getUserInfo(accessToken);

        String email = (String) userInfo.get("email");


        // 3. Upsert user
        UserEntity user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity newUser = new UserEntity();
                    newUser.setEmail(email);
                    newUser.setProviders(List.of(IdentityProvider.GOOGLE));
                    newUser.setRoles(List.of(Role.USER));
                    newUser.setCreatedAt(LocalDateTime.now());
                    newUser.setUsername(email);
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

    private String getAccessToken(String code) {

        String url = "https://oauth2.googleapis.com/token";

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");
        log.info("body de token {}",body);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> request = new HttpEntity<>(body, headers);

        Map<String, Object> response = restTemplate.postForObject(
                url,
                request,
                Map.class
        );

        return (String) response.get("access_token");
    }

    private Map<String, Object> getUserInfo(String token) {

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