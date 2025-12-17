package com.microservices.catalog.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.microservices.catalog.model.ProductEntity;
import com.microservices.catalog.repository.ProductRepository;

/**
 * DAO (Data Access Object) que expone métodos de acceso a datos mediante
 * el {@link ProductRepository} de Spring Data.
 */
@Component
public class ProductDAO {

    private final ProductRepository productRepository;

    public ProductDAO(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Devuelve todos los productos marcados como activos.
     *
     * @return lista de entidades {@link ProductEntity} activas
     */
    public List<ProductEntity> findAllActive() {
        return productRepository.findByActiveTrue();
    }

    /**
     * Busca un producto por su id.
     *
     * @param id identificador del producto
     * @return Optional con la entidad si existe
     */
    public Optional<ProductEntity> findById(Long id) {
        return productRepository.findById(id);
    }

    /**
     * Busca productos por categoría (solo activos).
     *
     * @param category nombre de la categoría
     * @return lista de entidades en la categoría
     */
    public List<ProductEntity> findByCategory(String category) {
        return productRepository.findByCategoryAndActiveTrue(category);
    }

    /**
     * Busca productos cuyo nombre contiene el texto dado.
     *
     * @param name fragmento a buscar
     * @return lista de entidades coincidentes
     */
    public List<ProductEntity> searchByName(String name) {
        return productRepository.findByNameContainingAndActiveTrue(name);
    }

    /**
     * Devuelve las categorías distintas de productos activos.
     *
     * @return lista de nombres de categoría
     */
    public List<String> findDistinctCategories() {
        return productRepository.findDistinctCategories();
    }

}
