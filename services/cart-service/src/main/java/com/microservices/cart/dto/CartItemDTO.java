package com.microservices.cart.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.microservices.core.dto.ProductDTO;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO que representa un item del carrito expuesto al cliente.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private UUID id;
    private ProductDTO product;
    private UUID productId;
    private Integer quantity;
}
