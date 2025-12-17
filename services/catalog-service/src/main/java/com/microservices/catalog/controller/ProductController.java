package com.microservices.catalog.controller;

import com.microservices.catalog.dto.ProductDTO;
import com.microservices.catalog.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar endpoints relacionados con productos.
 */
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ProductController {


    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Obtiene todos los productos activos.
     *
     * @return ResponseEntity con la lista de {@link ProductDTO}
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * Obtiene un producto por id.
     *
     * @param id identificador del producto
     * @return ResponseEntity con el {@link ProductDTO} o 404 si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Obtiene productos por categoría.
     *
     * @param category nombre de la categoría
     * @return ResponseEntity con la lista de {@link ProductDTO}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        List<ProductDTO> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    /**
     * Busca productos por nombre.
     *
     * @param name parámetro de búsqueda (fragmento)
     * @return ResponseEntity con los resultados o 204 si no hay resultados
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String name) {
        List<ProductDTO> products = productService.searchProductsByName(name);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 si no hay resultados
        }
        return ResponseEntity.ok(products);
    }

    /**
     * Obtiene las categorías distintas de productos activos.
     *
     * @return ResponseEntity con la lista de categorías
     */
    @GetMapping("/categories")
    public  ResponseEntity<List<String>> getCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
