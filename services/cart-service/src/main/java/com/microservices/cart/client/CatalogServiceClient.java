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

class ProductDto {
    private Long id;
    private String name;
    private String description;
    private java.math.BigDecimal price;
    private Integer stock;
    private String category;
    private String imageUrl;
    private boolean active;

    // Constructors
    public ProductDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public java.math.BigDecimal getPrice() { return price; }
    public void setPrice(java.math.BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
