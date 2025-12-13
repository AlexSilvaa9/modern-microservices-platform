package com.microservices.catalog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.microservices.catalog.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    List<Product> findByCategoryAndActiveTrue(String category);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:name% AND p.active = true")
    List<Product> findByNameContainingAndActiveTrue(@Param("name") String name);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.active = true")
    List<String> findDistinctCategories();

}
