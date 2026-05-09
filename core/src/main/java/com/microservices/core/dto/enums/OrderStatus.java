package com.microservices.core.dto.enums;

/**
 * Represents the lifecycle status of an Order in the system.
 *
 * <p>This enum defines all possible states an order can go through,
 * from creation to final completion or failure.</p>
 *
 * <p>Typical flow:</p>
 * <pre>
 * CREATED → PENDING_PAYMENT → PAID → SHIPPED → COMPLETED
 * </pre>
 */
public enum OrderStatus {

    /**
     * The order has been created but not yet processed.
     */
    CREATED,

    /**
     * The order has been created and is waiting for payment confirmation.
     */
    PENDING_PAYMENT,

    /**
     * The payment has been successfully completed.
     */
    PAID,

    /**
     * The payment attempt has failed.
     */
    PAYMENT_FAILED,

    /**
     * The order has been cancelled by the user or system.
     */
    CANCELLED,

    /**
     * The order has been shipped to the customer.
     */
    SHIPPED,

    /**
     * The order has been successfully delivered and completed.
     */
    COMPLETED,

    /**
     * An unexpected error occurred during order processing.
     */
    ERROR
}