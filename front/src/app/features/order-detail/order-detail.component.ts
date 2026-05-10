import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OrderDTO, OrderStatus } from '../../core/models/order.model';
import { OrderService } from '../../core/services/api/order.service';
import { UserStateService } from '../../core/services/global-state/user-state.service';
import { Role } from '../../core/models/user.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly userState = inject(UserStateService);

  readonly order = signal<OrderDTO | null>(null);
  readonly error = signal<string | null>(null);
  readonly isAdmin = signal(false);
  readonly OrderStatus = OrderStatus;

  ngOnInit(): void {
    const order = (window.history.state as any)?.['order'] as OrderDTO | null;

    if (order) {
      this.order.set(order);
    } else {
      this.error.set('Order data not found.');
    }

    const currentUser = this.userState.getCurrentUserValue();
    this.isAdmin.set(currentUser?.roles?.includes(Role.ADMIN) || false);
  }

  completeOrder(): void {
    const ord = this.order();

    if (!ord) return;

    this.orderService.markAsCompleted(ord.id).subscribe({
      next: () => {
        this.error.set(null);
        this.goBack();
      },
      error: () => this.error.set('Failed to mark order as completed.')
    });
  }

  goBack(): void {
    this.router.navigate(['/orders/history']);
  }

  isCompleted(order: OrderDTO): boolean {
    return order.status === OrderStatus.COMPLETED;
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'status-completed';
      case OrderStatus.SHIPPED:
        return 'status-shipped';
      case OrderStatus.PAID:
        return 'status-paid';
      case OrderStatus.PENDING_PAYMENT:
        return 'status-pending';
      case OrderStatus.PAYMENT_FAILED:
      case OrderStatus.CANCELLED:
      case OrderStatus.ERROR:
        return 'status-error';
      default:
        return 'status-default';
    }
  }
}
