package com.microservices.user.repository;

import com.microservices.user.model.UserEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * JPA Repository for managing UserEntity records.
 * Provides standard CRUD operations and custom queries for user details.
 */
@Repository
public interface UserEventRepository extends JpaRepository<UserEventEntity, UUID> {

    long countByEventType(String eventType);

    @Query("""
        SELECT e.path, COUNT(e)
        FROM UserEventEntity e
        WHERE e.eventType = 'PAGE_VIEW'
        GROUP BY e.path
    """)
    List<Object[]> countVisitsByPage();

    @Query("""
    SELECT FUNCTION('FORMATDATETIME', e.createdAt, 'yyyy-MM'), COUNT(e)
    FROM UserEventEntity e
    WHERE e.eventType = 'PAGE_VIEW'
    GROUP BY FUNCTION('FORMATDATETIME', e.createdAt, 'yyyy-MM')
""")
    List<Object[]> countVisitsByMonth();
}

