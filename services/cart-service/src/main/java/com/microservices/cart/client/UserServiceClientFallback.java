package com.microservices.cart.client;

import com.microservices.cart.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserServiceClientFallback implements UserServiceClient {

    @Override
    public UserDTO getUserById(String id) {
        // Retorno conservador: usuario inactivo/nulo
        UserDTO u = new UserDTO();
        u.setId(id);
        u.setActive(false);
        return u;
    }
}

