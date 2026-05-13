package com.microservices.product.dao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.microservices.product.model.ProductEntity;
import com.microservices.product.repository.ProductRepository;

/**
 * Data Access Object abstracting Spring Data repository calls for products.
 * Encapsulates the JPA repository to provide clean data access interfaces.
 */
@Component
public class ProductDAO {

    /** Underlying Spring Data JPA repository. */
    private final ProductRepository productRepository;

    /**
     * Constructs a new ProductDAO.
     *
     * @param productRepository the JPA repository for products
     */
    public ProductDAO(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Retrieves all products marked as active, applying pagination.
     *
     * @param pageable pagination parameters
     * @return a page of active product entities
     */
    public Page<ProductEntity> findAllActive(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable);
    }

    /**
     * Finds a product entity by its UUID.
     *
     * @param id the UUID of the product
     * @return an Optional containing the entity if found
     */
    public Optional<ProductEntity> findById(UUID id) {
        return productRepository.findById(id);
    }

    /**
     * Retrieves all active products belonging to the specified category.
     *
     * @param category the category name
     * @return a list of matching product entities
     */
    public List<ProductEntity> findByCategory(String category) {
        return productRepository.findByCategoryAndActiveTrue(category);
    }

    /**
     * Searches for active products containing the given substring in their name.
     *
     * @param name the name substring to match
     * @return a list of matching product entities
     */
    public List<ProductEntity> searchByName(String name) {
        return productRepository.findByNameContainingAndActiveTrue(name);
    }

    /**
     * Retrieves all distinct category names from active products.
     *
     * @return a list of unique category names
     */
    public List<String> findDistinctCategories() {
        return productRepository.findDistinctCategories();
    }

    /**
     * Retrieves multiple products by a list of their UUIDs.
     *
     * @param ids the list of UUIDs to query
     * @return a list of found product entities
     */
    public List<ProductEntity> findAllById(List<UUID> ids){
        return productRepository.findByIdIn(ids);
    }
}
