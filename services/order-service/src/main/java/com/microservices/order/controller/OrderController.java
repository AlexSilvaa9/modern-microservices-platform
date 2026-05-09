package com.microservices.order.controller;

import com.microservices.core.dto.order.OrderDTO;
import com.microservices.order.service.OrderService;
import com.microservices.core.dto.BaseApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


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
        orderService.createOrderFromCart();
        BaseApiResponse<Object> body = new BaseApiResponse<>(
                "OK",
                null);
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

    @PostMapping("paidOrders")
    public ResponseEntity<BaseApiResponse<Page<OrderDTO>>> paidOrders(Pageable pageable){

        var response = orderService.getPaidOrders(pageable);

        BaseApiResponse<Page<OrderDTO>> baseApiResponse = new BaseApiResponse("Paid orders fetched successfully", response);

        return ResponseEntity.ok(baseApiResponse);
    }



}
