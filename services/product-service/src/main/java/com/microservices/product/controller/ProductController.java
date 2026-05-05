package com.microservices.product.controller;

import com.microservices.product.service.ProductService;
import com.microservices.core.dto.BaseApiResponse;
import com.microservices.core.dto.ProductDTO;
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
 * Controlador REST para gestionar endpoints relacionados con productos.
 */
@RestController
@Validated
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Obtiene todos los productos activos.
     * Devuelve 200 con lista (vacía si no hay productos) en un ApiResponse
     * consistente.
     *
     * @return ResponseEntity con la lista de {@link ProductDTO}
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
     * Obtiene un producto por id.
     * Valida que el id sea positivo.
     * Si no existe, se lanza NoSuchElementException y el handler global lo
     * convertirá en 404.
     *
     * @param id identificador del producto
     * @return ResponseEntity con el {@link ProductDTO}
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

    @PostMapping("/batch")
    List<ProductDTO> getProductsByIds(@RequestBody List<UUID> ids){
        return  productService.getProductsById(ids);
    }
    /**
     * Obtiene productos por categoría.
     * Valida que la categoría no sea vacía.
     *
     * @param category nombre de la categoría
     * @return ResponseEntity con la lista de {@link ProductDTO} (200 con lista
     *         vacía si no hay coincidencias)
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
     * Busca productos por nombre.
     * Si no hay resultados, devuelve 200 con lista vacía en ApiResponse para
     * mantener contrato uniforme.
     *
     * @param name parámetro de búsqueda (fragmento)
     * @return ResponseEntity con los resultados (lista vacía si no hay resultados)
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
     * Obtiene las categorías distintas de productos activos.
     *
     * @return ResponseEntity con la lista de categorías
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
