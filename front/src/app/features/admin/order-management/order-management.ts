import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { OrderDTO, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/api/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, SkeletonModule, TooltipModule],
  templateUrl: './order-management.html',
  styleUrl: './order-management.scss'
})
export class OrderManagementComponent {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  OrderStatus = OrderStatus;
  statuses = Object.values(OrderStatus);

  orders = signal<OrderDTO[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  rows = signal(10);
  currentPage = signal(0);
  selectedStatus = signal<OrderStatus>(OrderStatus.PAID);


  loadOrders(page: number = 0, pageSize: number = this.rows(), status: OrderStatus = this.selectedStatus()) {
    this.loading.set(true);
    this.currentPage.set(page);
    this.selectedStatus.set(status);

    this.orderService.getByStatus(status, page, pageSize, 'createdAt,desc').subscribe({
      next: (response) => {
        this.orders.set(response.data.content);
        this.totalRecords.set(response.data.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.orders.set([]);
        this.totalRecords.set(0);
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: any) {
    const page = Math.floor((event.first || 0) / (event.rows || this.rows()));
    const pageSize = event.rows || this.rows();

    this.loadOrders(page, pageSize, this.selectedStatus());
  }

  onStatusChange(status: string) {
    this.loadOrders(0, this.rows(), status as OrderStatus);
  }

  completeOrder(order: OrderDTO) {
    this.orderService.markAsCompleted(order.id).subscribe({
      next: () => this.loadOrders(this.currentPage(), this.rows(), this.selectedStatus()),
      error: (error) => console.error('Error marking order as completed:', error)
    });
  }

  isCompleted(order: OrderDTO): boolean {
    return order.status === OrderStatus.COMPLETED;
  }

  viewOrderDetail(order: OrderDTO): void {
    this.router.navigate(['/order-detail'], { state: { order } });
  }
}