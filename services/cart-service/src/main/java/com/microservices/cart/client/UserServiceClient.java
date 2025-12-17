package com.microservices.cart.client;

import com.microservices.cart.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Cliente Feign para el User Service. La presencia de este cliente es opcional
 * y el servicio de carrito puede funcionar sin él (en cuyo caso no se hace
 * validación remota de usuario).
 */
@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/users/{id}")
    UserDTO getUserById(@PathVariable("id") String id);
}
