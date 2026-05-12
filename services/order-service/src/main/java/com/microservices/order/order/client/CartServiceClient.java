package com.microservices.order.order.client;


import com.microservices.core.common.dto.BaseApiResponse;
import com.microservices.core.common.dto.ShoppingCartDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * Feign Client for communicating with the Product Service.
 * Used to retrieve product details to enrich shopping cart data.
 */
@FeignClient(name = "cart-service")
public interface CartServiceClient {

    /**
     * Fetches User Cart
     *
     * @return a list of ProductDTOs containing the product details
     */
    @GetMapping("/api/cart/")
    BaseApiResponse<ShoppingCartDTO> getCart();
}

