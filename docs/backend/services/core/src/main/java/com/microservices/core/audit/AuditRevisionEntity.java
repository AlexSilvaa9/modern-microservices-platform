package com.microservices.core.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.RevisionEntity;
import org.hibernate.envers.RevisionNumber;
import org.hibernate.envers.RevisionTimestamp;

@Entity
@RevisionEntity(AuditRevisionListener.class)
@Table(name = "revinfo")
@Getter
@Setter
public class AuditRevisionEntity {

    @Id
    @RevisionNumber
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @RevisionTimestamp
    private long timestamp;

    // ===== SECURITY CONTEXT =====
    private String userEmail;

    @Column(length = 1000)
    private String roles;

    // ===== NETWORK CONTEXT =====
    private String ip;
    private String userAgent;



}