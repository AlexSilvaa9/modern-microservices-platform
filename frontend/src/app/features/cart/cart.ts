import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CartService } from '../../core/services/global-state/cart.service';
import { OrderService } from '../../core/services/api/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  readonly items = this.cartService.items;
  readonly itemCount = this.cartService.itemCount;
  readonly total = this.cartService.total;

  increase(itemId: string): void {
    this.cartService.increaseQuantity(itemId);
  }

  decrease(itemId: string): void {
    this.cartService.decreaseQuantity(itemId);
  }

  remove(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  clear(): void {
    this.cartService.clearCart();
  }
  checkout(): void {
    this.orderService.checkout().subscribe({
      next: (response) => {
        const orderUuid = response.data;

        if (!orderUuid) {
          alert('Checkout returned an empty order id.');
          return;
        }

        this.router.navigate(['/payment/mock', orderUuid]);
      },
      error: () => alert('Checkout failed. Please try again.')
    });
  }
}
