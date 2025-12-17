package com.microservices.cart.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.Builder;

/**
 * DTO que representa un carrito de compras para el cliente.
 */
@Data
@Builder
public class ShoppingCartDTO {
    private Long id;
    private String userId;
    private List<CartItemDTO> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

