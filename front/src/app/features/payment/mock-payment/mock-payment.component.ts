import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentMockService } from '../../../core/services/api/payment-mock.service';
import { CartService } from '../../../core/services/global-state/cart.service';

@Component({
  selector: 'app-mock-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mock-payment.component.html',
  styleUrl: './mock-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockPaymentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentMockService = inject(PaymentMockService);
  private readonly cartService = inject(CartService);

  readonly orderUuid = signal<string>('');
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);
  readonly processingPercent = signal(0);

  ngOnInit(): void {
    this.orderUuid.set(this.route.snapshot.paramMap.get('uuid') ?? '');
  }

  confirmPayment(): void {
    const uuid = this.orderUuid();

    if (!uuid) {
      this.error.set('Invalid order reference.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.processingPercent.set(0);

    const progressInterval = setInterval(() => {
      this.processingPercent.update(p => Math.min(p + Math.random() * 30, 90));
    }, 300);

    this.paymentMockService.confirmMockPayment(uuid).subscribe({
      next: () => {
        clearInterval(progressInterval);
        this.processingPercent.set(100);
        setTimeout(() => {
          this.loading.set(false);
          this.success.set(true);
          this.cartService.clearCart();
        }, 400);
      },
      error: () => {
        clearInterval(progressInterval);
        this.loading.set(false);
        this.error.set('Transaction declined. Please try again.');
      }
    });
  }

  goToHistory(): void {
    this.router.navigate(['/orders/history']);
  }
}