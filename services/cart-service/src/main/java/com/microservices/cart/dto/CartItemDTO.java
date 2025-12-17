package com.microservices.cart.dto;

import java.math.BigDecimal;

import lombok.Data;
import lombok.Builder;

/**
 * DTO que representa un item del carrito expuesto al cliente.
 */
@Data
@Builder
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}

