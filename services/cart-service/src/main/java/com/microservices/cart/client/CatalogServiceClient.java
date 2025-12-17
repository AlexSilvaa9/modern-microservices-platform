package com.microservices.cart.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "catalog-service")
public interface CatalogServiceClient {

    @GetMapping("/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);

    @PostMapping("/products/{id}/update-stock")
    Boolean updateStock(@PathVariable("id") Long id, @RequestParam Integer quantity);

}

