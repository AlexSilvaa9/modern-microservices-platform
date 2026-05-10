import { Page } from './page.model';

export enum OrderStatus {
    CREATED = 'CREATED',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAID = 'PAID',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    CANCELLED = 'CANCELLED',
    SHIPPED = 'SHIPPED',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR'
}

export interface ProductSnapshotDTO {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
}

export interface OrderItemDTO {
    id: string;
    productSnapshotEntity: ProductSnapshotDTO;
    quantity: number;
}

export interface OrderDTO {
    id: string;
    userEmail: string;
    status: OrderStatus;
    totalAmount: number;
    paymentIntentId: string;
    items: OrderItemDTO[];
    createdAt: string;
    updatedAt: string;
}

export type OrderPage = Page<OrderDTO>;