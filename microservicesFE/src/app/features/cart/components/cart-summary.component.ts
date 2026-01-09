import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartSummary } from '../../../shared/models';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-summary">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="bi bi-receipt me-2"></i>
            Resumen del pedido
          </h5>
        </div>
        
        <div class="card-body">
          <div class="summary-line" *ngIf="summary">
            <div class="d-flex justify-content-between">
              <span>Subtotal ({{ summary.itemCount }} artículo{{ summary.itemCount !== 1 ? 's' : '' }}):</span>
              <span>{{ summary.subtotal | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
          </div>

          <div class="summary-line" *ngIf="summary?.shipping !== undefined">
            <div class="d-flex justify-content-between">
              <span>Envío:</span>
              <span *ngIf="summary!.shipping > 0; else freeShipping">
                {{ summary!.shipping | currency:'USD':'symbol':'1.2-2' }}
              </span>
              <ng-template #freeShipping>
                <span class="text-success fw-bold">GRATIS</span>
              </ng-template>
            </div>
          </div>

          <div class="summary-line" *ngIf="summary?.tax !== undefined">
            <div class="d-flex justify-content-between">
              <span>Impuestos:</span>
              <span>{{ summary!.tax | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
          </div>

          <hr class="my-3">

          <div class="summary-total" *ngIf="summary">
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold fs-5">Total:</span>
              <span class="fw-bold fs-4 text-primary">
                {{ summary.total | currency:'USD':'symbol':'1.2-2' }}
              </span>
            </div>
          </div>

          <!-- Savings Information -->
          <div class="savings-info mt-3" *ngIf="savings > 0">
            <div class="alert alert-success py-2">
              <i class="bi bi-piggy-bank me-2"></i>
              <small>¡Ahorras {{ savings | currency:'USD':'symbol':'1.2-2' }} en este pedido!</small>
            </div>
          </div>

          <!-- Free Shipping Promotion -->
          <div class="shipping-promo mt-3" *ngIf="summary && showShippingPromo()">
            <div class="alert alert-info py-2">
              <i class="bi bi-truck me-2"></i>
              <small *ngIf="summary.subtotal >= freeShippingThreshold; else needMore">
                ¡Felicidades! Tu pedido califica para envío gratuito.
              </small>
              <ng-template #needMore>
                Agrega {{ (freeShippingThreshold - summary.subtotal) | currency:'USD':'symbol':'1.2-2' }} 
                más para envío gratuito.
              </ng-template>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="d-grid gap-2">
            <button 
              class="btn btn-primary btn-lg"
              (click)="onProceedToCheckout()"
              [disabled]="!summary || summary.itemCount === 0 || isProcessing">
              <i class="bi bi-credit-card me-2" *ngIf="!isProcessing"></i>
              <div class="spinner-border spinner-border-sm me-2" role="status" *ngIf="isProcessing">
                <span class="visually-hidden">Procesando...</span>
              </div>
              {{ isProcessing ? 'Procesando...' : 'Proceder al pago' }}
            </button>
            
            <button 
              class="btn btn-outline-secondary"
              (click)="onContinueShopping()"
              [disabled]="isProcessing">
              <i class="bi bi-arrow-left me-2"></i>
              Continuar comprando
            </button>
          </div>
        </div>
      </div>

      <!-- Accepted Payment Methods -->
      <div class="payment-methods mt-3">
        <div class="card">
          <div class="card-body py-2">
            <div class="text-center">
              <small class="text-muted d-block mb-2">Métodos de pago aceptados</small>
              <div class="payment-icons">
                <i class="bi bi-credit-card fs-5 me-2 text-muted" title="Tarjetas de crédito"></i>
                <i class="bi bi-paypal fs-5 me-2 text-muted" title="PayPal"></i>
                <i class="bi bi-apple fs-5 me-2 text-muted" title="Apple Pay"></i>
                <i class="bi bi-google fs-5 text-muted" title="Google Pay"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Badge -->
      <div class="security-badge mt-3 text-center">
        <small class="text-muted">
          <i class="bi bi-shield-check text-success me-1"></i>
          Compra 100% segura y protegida
        </small>
      </div>
    </div>
  `,
  styles: [`
    .cart-summary {
      position: sticky;
      top: 2rem;
    }

    .card {
      border: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
    }

    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      border-radius: 12px 12px 0 0 !important;
      padding: 1rem 1.25rem;
    }

    .card-title {
      color: #495057;
      font-weight: 600;
    }

    .summary-line {
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .summary-line span:first-child {
      color: #6c757d;
    }

    .summary-total {
      font-size: 1.1rem;
    }

    .btn-lg {
      padding: 0.75rem 1.25rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      border: none;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    }

    .savings-info .alert {
      border-radius: 8px;
      border: none;
    }

    .shipping-promo .alert {
      border-radius: 8px;
      border: none;
    }

    .payment-methods .card {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .payment-icons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .security-badge {
      font-size: 0.85rem;
    }

    .card-footer {
      background-color: transparent;
      border-top: 1px solid #dee2e6;
      border-radius: 0 0 12px 12px !important;
      padding: 1rem 1.25rem;
    }

    @media (max-width: 768px) {
      .cart-summary {
        position: relative;
        top: auto;
        margin-top: 2rem;
      }
      
      .card-body {
        padding: 1rem;
      }
      
      .btn-lg {
        padding: 0.875rem 1rem;
      }
    }
  `]
})
export class CartSummaryComponent {
  @Input() summary: CartSummary | null = null;
  @Input() savings = 0;
  @Input() isProcessing = false;
  
  @Output() proceedToCheckout = new EventEmitter<void>();
  @Output() continueShopping = new EventEmitter<void>();

  readonly freeShippingThreshold = 50; // $50 for free shipping

  onProceedToCheckout() {
    this.proceedToCheckout.emit();
  }

  onContinueShopping() {
    this.continueShopping.emit();
  }

  showShippingPromo(): boolean {
    return this.summary !== null && this.summary.subtotal > 0;
  }
}
