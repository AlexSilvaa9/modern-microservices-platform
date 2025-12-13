package com.microservices.log.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.log.model.ApplicationLog;

@Repository
public interface LogRepository extends JpaRepository<ApplicationLog, Long> {

    List<ApplicationLog> findByServiceNameOrderByTimestampDesc(String serviceName);

    List<ApplicationLog> findByLevelOrderByTimestampDesc(ApplicationLog.LogLevel level);

    Page<ApplicationLog> findByServiceName(String serviceName, Pageable pageable);

    Page<ApplicationLog> findByLevel(ApplicationLog.LogLevel level, Pageable pageable);

    Page<ApplicationLog> findByServiceNameAndLevel(String serviceName, ApplicationLog.LogLevel level, Pageable pageable);

    @Query("SELECT l FROM ApplicationLog l ORDER BY l.timestamp DESC")
    List<ApplicationLog> findTopByOrderByTimestampDesc(@Param("limit") int limit);

    @Modifying
    @Transactional
    @Query("DELETE FROM ApplicationLog l WHERE l.timestamp < :cutoffDate")
    long deleteByTimestampBefore(@Param("cutoffDate") LocalDateTime cutoffDate);

    List<ApplicationLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

}
