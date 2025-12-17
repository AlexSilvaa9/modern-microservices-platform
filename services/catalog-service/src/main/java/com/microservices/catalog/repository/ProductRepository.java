package com.microservices.catalog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.microservices.catalog.model.ProductEntity;

/**
 * Repositorio Spring Data para operaciones CRUD y consultas específicas sobre
 * {@link ProductEntity}.
 */
@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    /**
     * Encuentra todos los productos marcados como activos.
     *
     * @return lista de entidades activas
     */
    List<ProductEntity> findByActiveTrue();

    /**
     * Encuentra productos activos por categoría.
     *
     * @param category nombre de la categoría
     * @return lista de entidades en la categoría
     */
    List<ProductEntity> findByCategoryAndActiveTrue(String category);

    /**
     * Busca productos cuyo nombre contiene el valor dado (LIKE %name%).
     *
     * @param name fragmento de nombre a buscar
     * @return lista de entidades coincidentes
     */
    @Query("SELECT p FROM ProductEntity p WHERE p.name LIKE CONCAT('%', :name, '%') AND p.active = true")
    List<ProductEntity> findByNameContainingAndActiveTrue(@Param("name") String name);

    /**
     * Devuelve las categorías distintas para productos activos.
     *
     * @return lista de nombres de categoría
     */
    @Query("SELECT DISTINCT p.category FROM ProductEntity p WHERE p.active = true")
    List<String> findDistinctCategories();

}
