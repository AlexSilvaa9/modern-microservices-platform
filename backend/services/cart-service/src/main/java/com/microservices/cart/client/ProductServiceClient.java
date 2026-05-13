package com.microservices.cart.client;

import com.microservices.core.common.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Feign Client for communicating with the Product Service.
 * Used to retrieve product details to enrich shopping cart data.
 */
@FeignClient(name = "product-service")
public interface ProductServiceClient {

    /**
     * Fetches metadata for a batch of products given their IDs.
     *
     * @param ids the list of product UUIDs to fetch
     * @return a list of ProductDTOs containing the product details
     */
    @PostMapping("/api/product/batch")
    List<ProductDTO> getProductsByIds(@RequestBody List<UUID> ids);
}

