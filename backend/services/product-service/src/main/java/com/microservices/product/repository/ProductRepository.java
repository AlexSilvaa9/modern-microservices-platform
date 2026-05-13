package com.microservices.product.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.microservices.product.model.ProductEntity;

/**
 * JPA Repository for executing CRUD and custom queries on ProductEntity.
 * Filters are predominantly applied to ensure only active products are retrieved.
 */
@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {

    /**
     * Retrieves a paginated list of active products.
     *
     * @param pageable pagination parameters
     * @return a page of active products
     */
    Page<ProductEntity> findByActiveTrue(Pageable pageable);

    /**
     * Retrieves active products filtered by exact category name.
     *
     * @param category the category to filter by
     * @return a list of active products in the category
     */
    List<ProductEntity> findByCategoryAndActiveTrue(String category);

    /**
     * Searches active products by partial name match.
     *
     * @param name the substring to search for in product names
     * @return a list of matching active products
     */
    @Query("SELECT p FROM ProductEntity p WHERE p.name LIKE CONCAT('%', :name, '%') AND p.active = true")
    List<ProductEntity> findByNameContainingAndActiveTrue(@Param("name") String name);

    /**
     * Retrieves unique category names mapped to at least one active product.
     *
     * @return a list of distinct active categories
     */
    @Query("SELECT DISTINCT p.category FROM ProductEntity p WHERE p.active = true")
    List<String> findDistinctCategories();

    /**
     * Finds a single product by its ID.
     *
     * @param id the product UUID
     * @return an Optional containing the product if found
     */
    Optional<ProductEntity> findById(UUID id);

    /**
     * Finds multiple products by a collection of IDs.
     *
     * @param ids the list of UUIDs
     * @return a list of matching products
     */
    List<ProductEntity> findByIdIn(List<UUID> ids);
}
