package com.microservices.order.controller;

import com.microservices.core.dto.enums.OrderStatus;
import com.microservices.core.dto.order.OrderDTO;
import com.microservices.order.service.OrderService;
import com.microservices.core.dto.BaseApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


/**
 * REST controller managing order operations.
 */
@RestController
public class OrderController {

    /** Service handling core shopping cart business logic. */
    private final OrderService orderService;

    /**
     * Constructs a new OrderController.
     *
     * @param orderService the order service
     */
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @GetMapping
    public ResponseEntity<BaseApiResponse<Object>> createOrder() {
        UUID orderId = orderService.createOrderFromCart();
        BaseApiResponse<Object> body = new BaseApiResponse<>(
                "OK",
                orderId);
        return ResponseEntity.ok(body);

    }

    @PostMapping("orderHistory")
    public ResponseEntity<BaseApiResponse<Page<OrderDTO>>> orderHistory(Authentication authentication,
                                                                        Pageable pageable){
        String email = authentication.getName();

        var response = orderService.getOrderHistory(email, pageable);

        BaseApiResponse<Page<OrderDTO>> baseApiResponse = new BaseApiResponse("Order history fetched successfully", response);

        return ResponseEntity.ok(baseApiResponse);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("getByStatus")
    public ResponseEntity<BaseApiResponse<Page<OrderDTO>>> getByStatus(
            Pageable pageable,
            @RequestParam(name = "orderStatus") OrderStatus status
            ){

        var response = orderService.getOrderByStatus(status, pageable);

        BaseApiResponse<Page<OrderDTO>> baseApiResponse = new BaseApiResponse("Orders fetched successfully", response);

        return ResponseEntity.ok(baseApiResponse);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("markAsCompleted")
    public ResponseEntity<BaseApiResponse<Page<OrderDTO>>> markAsCompleted(
            @RequestParam(name = "orderUuid")UUID orderUuid
            ){

        orderService.markAsCompleted(orderUuid);

        BaseApiResponse<Page<OrderDTO>> baseApiResponse = new BaseApiResponse("Order updated succesfully", null);

        return ResponseEntity.ok(baseApiResponse);
    }



}
