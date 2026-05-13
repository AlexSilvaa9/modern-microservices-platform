import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { OrderDTO, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/api/order.service';
import { ErrorService } from '../../../core/services/global-state/error.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, TableModule, SkeletonModule, ButtonModule, TooltipModule, TranslatePipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss'
})
export class OrderHistoryComponent{
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly errorService = inject(ErrorService);

  OrderStatus = OrderStatus;

  orders = signal<OrderDTO[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  rows = signal(10);
  currentPage = signal(0);


  loadOrders(page: number = 0, pageSize: number = this.rows()) {
    this.loading.set(true);
    this.currentPage.set(page);

    this.orderService.orderHistory(page, pageSize, 'createdAt,desc').subscribe({
      next: (response) => {
        this.orders.set(response.data.content);
        this.totalRecords.set(response.data.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorService.showError({
          message: error.error?.message || 'Error loading order history',
          errors: error.error?.errors,
          timestamp: error.error?.timestamp
        });
        this.orders.set([]);
        this.totalRecords.set(0);
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: any) {
    const page = Math.floor((event.first || 0) / (event.rows || this.rows()));
    const pageSize = event.rows || this.rows();

    this.loadOrders(page, pageSize);
  }

  isNotCompleted(order: OrderDTO): boolean {
    return order.status !== OrderStatus.COMPLETED;
  }

  viewOrderDetail(order: OrderDTO): void {
    this.router.navigate(['/order-detail'], { state: { order } });
  }
}