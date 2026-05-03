package com.microservices.cart.client;

import com.microservices.core.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "product-service")
public interface ProductServiceClient {

    @PostMapping("/api/product/batch")
    List<ProductDTO> getProductsByIds(@RequestBody List<UUID> ids);
}

