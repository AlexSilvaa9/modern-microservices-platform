import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CartService } from '../../core/services/global-state/cart.service';

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

  readonly items = this.cartService.items;
  readonly itemCount = this.cartService.itemCount;
  readonly subtotal = this.cartService.subtotal;
  readonly shipping = this.cartService.shipping;
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
}
