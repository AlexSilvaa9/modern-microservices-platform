import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '../../../store';
import { 
  selectCart, 
  selectCartItems, 
  selectCartSummary, 
  selectCartLoading, 
  selectCartError 
} from '../../../store/cart/cart.selectors';
import { 
  loadCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  loadCartSummary 
} from '../../../store/cart/cart.actions';

import { Cart, CartItem, CartSummary, UpdateCartItemRequest } from '../../../shared/models';
import { CartItemComponent } from '../components/cart-item.component';
import { CartSummaryComponent } from '../components/cart-summary.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CartItemComponent, CartSummaryComponent],
  template: `
    <div class="cart-page">
      <div class="container">
        <!-- Page Header -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="page-header">
              <h1 class="page-title">
                <i class="bi bi-cart3 me-2"></i>
                Mi carrito de compras
              </h1>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <a routerLink="/" class="text-decoration-none">Inicio</a>
                  </li>
                  <li class="breadcrumb-item">
                    <a routerLink="/catalog" class="text-decoration-none">Catálogo</a>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">Carrito</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div class="row" *ngIf="loading$ | async">
          <div class="col-12">
            <div class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando carrito...</span>
              </div>
              <p class="mt-3 text-muted">Cargando tu carrito...</p>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div class="row" *ngIf="error$ | async as error">
          <div class="col-12">
            <div class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
              <button class="btn btn-outline-danger btn-sm ms-3" (click)="retryLoad()">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Reintentar
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Content -->
        <div class="row" *ngIf="!(loading$ | async) && !(error$ | async)">
          <!-- Empty Cart -->
          <div class="col-12" *ngIf="cartItems.length === 0">
            <div class="empty-cart text-center py-5">
              <i class="bi bi-cart-x display-1 text-muted mb-4"></i>
              <h3 class="mb-3">Tu carrito está vacío</h3>
              <p class="text-muted mb-4">
                Parece que aún no has agregado ningún producto a tu carrito.
                <br>
                ¡Explora nuestro catálogo y encuentra productos increíbles!
              </p>
              <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-primary" (click)="onContinueShopping()">
                  <i class="bi bi-arrow-left me-2"></i>
                  Explorar productos
                </button>
                <button class="btn btn-outline-secondary" (click)="loadRecommended()">
                  <i class="bi bi-stars me-2"></i>
                  Ver recomendados
                </button>
              </div>
            </div>
          </div>

          <!-- Cart Items -->
          <div class="col-lg-8" *ngIf="cartItems.length > 0">
            <div class="cart-items">
              <!-- Cart Header -->
              <div class="cart-header d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">
                  Productos en tu carrito ({{ cartItems.length }})
                </h4>
                <div class="cart-actions">
                  <button 
                    class="btn btn-outline-danger btn-sm"
                    (click)="onClearCart()"
                    [disabled]="isProcessing">
                    <i class="bi bi-trash me-1"></i>
                    Vaciar carrito
                  </button>
                </div>
              </div>

              <!-- Items List -->
              <div class="items-list">
                <app-cart-item
                  *ngFor="let item of cartItems; trackBy: trackByItemId"
                  [item]="item"
                  [updating]="updatingItems.has(item.id)"
                  [isRemoving]="removingItems.has(item.id)"
                  (quantityChange)="onQuantityChange($event)"
                  (remove)="onRemoveItem($event)"
                  (saveForLater)="onSaveForLater($event)">
                </app-cart-item>
              </div>

              <!-- Continue Shopping -->
              <div class="continue-shopping mt-4">
                <button class="btn btn-link p-0" (click)="onContinueShopping()">
                  <i class="bi bi-arrow-left me-2"></i>
                  Continuar comprando
                </button>
              </div>
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="col-lg-4" *ngIf="cartItems.length > 0">
            <app-cart-summary
              [summary]="cartSummary$ | async"
              [savings]="calculateSavings()"
              [isProcessing]="isProcessing"
              (proceedToCheckout)="onProceedToCheckout()"
              (continueShopping)="onContinueShopping()">
            </app-cart-summary>
          </div>
        </div>

        <!-- Recently Viewed Products -->
        <div class="row mt-5" *ngIf="cartItems.length > 0">
          <div class="col-12">
            <div class="recently-viewed">
              <h5 class="mb-3">
                <i class="bi bi-clock-history me-2"></i>
                Productos vistos recientemente
              </h5>
              <div class="row g-3">
                <div class="col-md-3" *ngFor="let product of recentlyViewed">
                  <div class="card h-100">
                    <img [src]="product.imageUrl" class="card-img-top" [alt]="product.name" style="height: 150px; object-fit: cover;">
                    <div class="card-body p-2">
                      <h6 class="card-title small">{{ product.name }}</h6>
                      <p class="card-text text-primary fw-bold small">
                        {{ product.price | currency:'USD':'symbol':'1.2-2' }}
                      </p>
                      <button class="btn btn-outline-primary btn-sm w-100" (click)="addRecentToCart(product)">
                        <i class="bi bi-cart-plus me-1"></i>
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Cart Confirmation Modal -->
    <div class="modal fade" id="clearCartModal" tabindex="-1" *ngIf="showClearCartModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vaciar carrito</h5>
            <button type="button" class="btn-close" (click)="closeClearCartModal()"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar todos los productos de tu carrito?</p>
            <p class="text-muted small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeClearCartModal()">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" (click)="confirmClearCart()">
              <i class="bi bi-trash me-1"></i>
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      min-height: calc(100vh - 200px);
      padding: 2rem 0;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      color: #495057;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .breadcrumb {
      background: none;
      padding: 0;
      margin: 0;
      font-size: 0.9rem;
    }

    .breadcrumb-item + .breadcrumb-item::before {
      content: "›";
      font-weight: bold;
    }

    .cart-header {
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 1rem;
    }

    .empty-cart {
      background: #fff;
      border-radius: 12px;
      padding: 4rem 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .empty-cart i {
      font-size: 5rem;
    }

    .items-list {
      max-height: 70vh;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .items-list::-webkit-scrollbar {
      width: 6px;
    }

    .items-list::-webkit-scrollbar-track {
      background: #f8f9fa;
      border-radius: 3px;
    }

    .items-list::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 3px;
    }

    .items-list::-webkit-scrollbar-thumb:hover {
      background: #adb5bd;
    }

    .continue-shopping {
      border-top: 1px solid #dee2e6;
      padding-top: 1rem;
    }

    .recently-viewed {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .recently-viewed .card {
      border: 1px solid #e9ecef;
      transition: all 0.3s ease;
    }

    .recently-viewed .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .modal-content {
      border-radius: 12px;
      border: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      border-radius: 12px 12px 0 0;
    }

    .modal-footer {
      border-top: 1px solid #dee2e6;
      border-radius: 0 0 12px 12px;
    }

    @media (max-width: 768px) {
      .cart-page {
        padding: 1rem 0;
      }
      
      .page-header {
        text-align: center;
      }
      
      .cart-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .cart-actions {
        align-self: center;
      }
      
      .empty-cart {
        padding: 2rem 1rem;
      }
      
      .items-list {
        max-height: none;
        overflow: visible;
      }
    }
  `]
})
export class CartPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cartItems: CartItem[] = [];
  updatingItems = new Set<string>();
  removingItems = new Set<string>();
  isProcessing = false;
  showClearCartModal = false;
  recentlyViewed: any[] = []; // This would come from a service

  // Observables
  cart$!: Observable<Cart | null>;
  cartItems$!: Observable<CartItem[]>;
  cartSummary$!: Observable<CartSummary | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeObservables();
    this.loadCartData();
    this.subscribeToCartItems();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeObservables() {
    this.cart$ = this.store.select(selectCart);
    this.cartItems$ = this.store.select(selectCartItems);
    this.cartSummary$ = this.store.select(selectCartSummary);
    this.loading$ = this.store.select(selectCartLoading);
    this.error$ = this.store.select(selectCartError);
  }

  private loadCartData() {
    this.store.dispatch(loadCart());
    this.store.dispatch(loadCartSummary());
  }

  private subscribeToCartItems() {
    this.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
      });
  }

  onQuantityChange(request: UpdateCartItemRequest) {
    this.updatingItems.add(request.cartItemId);
    this.store.dispatch(updateCartItem({ request }));

    // Remove from updating set after a delay (this would be better handled in effects)
    setTimeout(() => {
      this.updatingItems.delete(request.cartItemId);
    }, 1000);
  }

  onRemoveItem(cartItemId: string) {
    this.removingItems.add(cartItemId);
    this.store.dispatch(removeFromCart({ cartItemId }));

    // Remove from removing set after a delay
    setTimeout(() => {
      this.removingItems.delete(cartItemId);
    }, 1000);
  }

  onSaveForLater(item: CartItem) {
    // Implement save for later functionality
    console.log('Save for later:', item);
  }

  onClearCart() {
    this.showClearCartModal = true;
  }

  confirmClearCart() {
    this.isProcessing = true;
    this.store.dispatch(clearCart());
    this.closeClearCartModal();
    
    setTimeout(() => {
      this.isProcessing = false;
    }, 1000);
  }

  closeClearCartModal() {
    this.showClearCartModal = false;
  }

  onProceedToCheckout() {
    this.router.navigate(['/checkout']);
  }

  onContinueShopping() {
    this.router.navigate(['/catalog']);
  }

  retryLoad() {
    this.loadCartData();
  }

  loadRecommended() {
    this.router.navigate(['/catalog'], { queryParams: { featured: true } });
  }

  addRecentToCart(product: any) {
    // Implement add to cart for recently viewed products
    console.log('Add recent to cart:', product);
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  calculateSavings(): number {
    // Calculate savings based on discounts, promotions, etc.
    return 0;
  }
}
