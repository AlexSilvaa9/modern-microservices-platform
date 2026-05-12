package com.microservices.product.controller;

import com.microservices.product.service.ProductService;
import com.microservices.core.common.dto.BaseApiResponse;
import com.microservices.core.common.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

/**
 * REST controller managing product catalog endpoints.
 * Handles HTTP requests for retrieving and searching active products.
 */
@RestController
@Validated
public class ProductController {

    /** Service providing core product business logic. */
    private final ProductService productService;

    /**
     * Constructs a new ProductController.
     *
     * @param productService the product service
     */
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Retrieves a paginated list of all active products in the catalog.
     *
     * @param pageable pagination and sorting parameters
     * @return a successful response containing a page of product DTOs
     */
    @GetMapping
    public ResponseEntity<BaseApiResponse<Page<ProductDTO>>> getAllProducts(Pageable pageable) {
        Page<ProductDTO> products = productService.getAllActiveProducts(pageable);

        BaseApiResponse<Page<ProductDTO>> body = new BaseApiResponse<>(
                products.isEmpty() ? "No products" : "OK",
                products);
        return ResponseEntity.ok(body);
    }

    /**
     * Retrieves a specific product by its unique identifier.
     *
     * @param id the UUID of the product
     * @return a successful response containing the product DTO
     * @throws NoSuchElementException if the product is not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<BaseApiResponse<ProductDTO>> getProductById(@PathVariable(name = "id", required = true)  UUID id) {
        ProductDTO dto = productService.getProductById(id)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado con id: " + id));
        BaseApiResponse<ProductDTO> body = new BaseApiResponse<>(
                "OK",
                dto);
        return ResponseEntity.ok(body);
    }

    /**
     * Retrieves a batch of products by their identifiers.
     * Used internally by other microservices via Feign clients.
     *
     * @param ids the list of product UUIDs
     * @return a list of matching product DTOs
     */
    @PostMapping("/batch")
    List<ProductDTO> getProductsByIds(@RequestBody List<UUID> ids){
        return  productService.getProductsById(ids);
    }
    /**
     * Retrieves a list of active products filtered by category.
     *
     * @param category the exact category name to filter by
     * @return a successful response containing the list of matching product DTOs
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<BaseApiResponse<List<ProductDTO>>> getProductsByCategory(
            @PathVariable @NotBlank String category) {
        List<ProductDTO> products = productService.getProductsByCategory(category.trim());
        BaseApiResponse<List<ProductDTO>> body = new BaseApiResponse<>(
                products.isEmpty() ? "No results" : "OK",
                products);
        // Devolver 200 con lista vacía es frecuente para endpoints que devuelven
        // colecciones
        return ResponseEntity.ok(body);
    }

    /**
     * Searches for active products whose name contains the specified search term.
     *
     * @param name the substring to search for within product names
     * @return a successful response containing the list of matching product DTOs
     */
    @GetMapping("/search")
    public ResponseEntity<BaseApiResponse<List<ProductDTO>>> searchProducts(
            @RequestParam(name = "name") @NotBlank String name) {
        List<ProductDTO> products = productService.searchProductsByName(name.trim());
        BaseApiResponse<List<ProductDTO>> body = new BaseApiResponse<>(
                products.isEmpty() ? "No results" : "OK",
                products);
        return ResponseEntity.ok(body);
    }

    /**
     * Retrieves all distinct categories currently assigned to active products.
     *
     * @return a successful response containing a list of category names
     */
    @GetMapping("/categories")
    public ResponseEntity<BaseApiResponse<List<String>>> getCategories() {
        List<String> categories = productService.getAllCategories();
        BaseApiResponse<List<String>> body = new BaseApiResponse<>(
                categories.isEmpty() ? "No categories" : "OK",
                categories);
        return ResponseEntity.ok(body);
    }
}
