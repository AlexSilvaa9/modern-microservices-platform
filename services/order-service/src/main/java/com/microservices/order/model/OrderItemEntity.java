package com.microservices.order.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Embedded
    private ProductSnapshot productSnapshotEntity;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderEntity order;
}