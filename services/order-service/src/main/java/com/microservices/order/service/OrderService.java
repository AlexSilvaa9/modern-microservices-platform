package com.microservices.order.service;

import java.math.BigDecimal;
import java.util.*;


import com.microservices.core.dto.enums.OrderStatus;
import com.microservices.order.client.CartServiceClient;
import com.microservices.order.dto.MockPaymentWebhook;
import com.microservices.core.dto.order.OrderDTO;
import com.microservices.order.mapper.OrderMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.microservices.order.dao.OrderDao;
import com.microservices.order.model.OrderEntity;


@Service
@Slf4j
public class OrderService {

    private final OrderDao dao;
    private final OrderMapper orderMapper;
    private final CartServiceClient cartServiceClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderService(OrderDao dao, OrderMapper orderMapper, CartServiceClient cartServiceClient, KafkaTemplate<String, Object> kafkaTemplate) {
        this.dao = dao;
        this.orderMapper = orderMapper;
        this.cartServiceClient = cartServiceClient;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public void createOrderFromCart() {
        var cart = cartServiceClient.getCart();
        OrderEntity orderEntity = Optional.ofNullable(cart.data()).map(orderMapper::fromCartToEntity).orElseThrow(() -> new RuntimeException("Error al obtener carrito"));
        orderEntity.setStatus(OrderStatus.CREATED);

        BigDecimal total = orderEntity.getItems().stream()
                .map(item ->
                        item.getProductSnapshotEntity()
                                .getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity()))
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        orderEntity.setTotalAmount(total);

        orderEntity.getItems().forEach(orderItemEntity -> orderItemEntity.setOrder(orderEntity));

        dao.save(orderEntity);
    }
    @Transactional
    public void markAsPaid(OrderEntity orderEntity){
        orderEntity.setStatus(OrderStatus.PAID);
        dao.save(orderEntity);

    }
    @KafkaListener(topics = "success-payment-topic", groupId = "order-group")
    public void handleSuccessPayment(MockPaymentWebhook mockPaymentWebhook) {
        Optional<OrderEntity> orderEntityOptional = dao.findById(mockPaymentWebhook.uuid());
        if (orderEntityOptional.isEmpty()){
            log.error("No se ha encontrado el order con uuid: {}", mockPaymentWebhook.uuid());
        } else {
            markAsPaid(orderEntityOptional.get());
            kafkaTemplate.send("order-paid-topic", orderMapper.toDTO(orderEntityOptional.get()));
        }

    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getOrderHistory(String email, Pageable pageable){
        return dao.findByUserEmail(email, pageable).map(orderMapper::toDTO);
    }
    @Transactional(readOnly = true)
    public Page<OrderDTO> getPaidOrders(Pageable pageable){
        return dao.findByStatus(OrderStatus.PAID, pageable).map(orderMapper::toDTO);
    }
}