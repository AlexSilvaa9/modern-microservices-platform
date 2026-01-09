import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartItem, UpdateCartItemRequest } from '../../../shared/models';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cart-item" [class.removing]="isRemoving">
      <div class="row align-items-center g-3">
        <!-- Product Image -->
        <div class="col-md-2">
          <div class="product-image-container">
            <img 
              [src]="item.product.imageUrl" 
              [alt]="item.product.name"
              class="img-fluid rounded"
              (error)="onImageError($event)">
          </div>
        </div>

        <!-- Product Details -->
        <div class="col-md-4">
          <div class="product-details">
            <h5 class="product-name mb-1">
              <a [routerLink]="['/catalog/product', item.product.id]" class="text-decoration-none">
                {{ item.product.name }}
              </a>
            </h5>
            <p class="product-description text-muted mb-2">
              {{ item.product.description | slice:0:80 }}{{ item.product.description.length > 80 ? '...' : '' }}
            </p>
            <span class="badge bg-light text-dark">{{ item.product.category | titlecase }}</span>
          </div>
        </div>

        <!-- Price -->
        <div class="col-md-2">
          <div class="price-info text-center">
            <div class="unit-price text-muted small">
              {{ item.product.price | currency:'USD':'symbol':'1.2-2' }} c/u
            </div>
          </div>
        </div>

        <!-- Quantity Controls -->
        <div class="col-md-2">
          <div class="quantity-controls">
            <label class="form-label small text-muted">Cantidad</label>
            <div class="input-group input-group-sm">
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                (click)="decrementQuantity()"
                [disabled]="item.quantity <= 1 || updating">
                <i class="bi bi-dash"></i>
              </button>
              
              <input 
                type="number" 
                class="form-control text-center quantity-input"
                [value]="item.quantity"
                (change)="onQuantityChange($event)"
                (blur)="onQuantityBlur($event)"
                min="1"
                max="99"
                [disabled]="updating">
              
              <button 
                class="btn btn-outline-secondary" 
                type="button"
                (click)="incrementQuantity()"
                [disabled]="item.quantity >= 99 || item.quantity >= item.product.stock || updating">
                <i class="bi bi-plus"></i>
              </button>
            </div>
            <small class="text-muted" *ngIf="item.product.stock">
              Stock disponible: {{ item.product.stock }}
            </small>
          </div>
        </div>

        <!-- Subtotal & Actions -->
        <div class="col-md-2">
          <div class="item-actions text-end">
            <div class="subtotal mb-2">
              <span class="fw-bold fs-5 text-primary">
                {{ item.subtotal | currency:'USD':'symbol':'1.2-2' }}
              </span>
            </div>
            
            <div class="action-buttons">
              <button 
                class="btn btn-sm btn-outline-danger"
                (click)="onRemove()"
                [disabled]="isRemoving"
                title="Eliminar del carrito">
                <i class="bi bi-trash" *ngIf="!isRemoving"></i>
                <div class="spinner-border spinner-border-sm" role="status" *ngIf="isRemoving">
                  <span class="visually-hidden">Eliminando...</span>
                </div>
              </button>
              
              <button 
                class="btn btn-sm btn-outline-secondary ms-1"
                (click)="onSaveForLater()"
                title="Guardar para después">
                <i class="bi bi-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="updating">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Actualizando...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-item {
      background: #fff;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .cart-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .cart-item.removing {
      opacity: 0.6;
      transform: scale(0.98);
    }

    .product-image-container {
      position: relative;
      width: 100%;
      height: 100px;
      overflow: hidden;
      border-radius: 8px;
      background-color: #f8f9fa;
    }

    .product-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-name {
      font-weight: 600;
      line-height: 1.3;
    }

    .product-name a {
      color: #495057;
      transition: color 0.3s ease;
    }

    .product-name a:hover {
      color: #007bff;
    }

    .product-description {
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .quantity-controls {
      max-width: 120px;
    }

    .quantity-input {
      max-width: 60px;
      font-weight: 600;
    }

    .quantity-input:focus {
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .subtotal {
      font-size: 1.1rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
      justify-content: flex-end;
    }

    .btn-sm {
      padding: 0.375rem 0.5rem;
      font-size: 0.8rem;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .price-info {
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .cart-item {
        padding: 1rem;
      }
      
      .row {
        margin: 0;
      }
      
      .col-md-2,
      .col-md-4 {
        padding: 0.5rem 0;
      }
      
      .product-image-container {
        height: 80px;
      }
      
      .action-buttons {
        justify-content: center;
        margin-top: 1rem;
      }
    }
  `]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Input() updating = false;
  @Input() isRemoving = false;
  
  @Output() quantityChange = new EventEmitter<UpdateCartItemRequest>();
  @Output() remove = new EventEmitter<string>();
  @Output() saveForLater = new EventEmitter<CartItem>();

  private currentQuantity: number = 1;

  ngOnInit() {
    this.currentQuantity = this.item.quantity;
  }

  incrementQuantity() {
    if (this.item.quantity < Math.min(99, this.item.product.stock)) {
      this.updateQuantity(this.item.quantity + 1);
    }
  }

  decrementQuantity() {
    if (this.item.quantity > 1) {
      this.updateQuantity(this.item.quantity - 1);
    }
  }

  onQuantityChange(event: any) {
    const newQuantity = parseInt(event.target.value, 10);
    this.validateAndUpdateQuantity(newQuantity);
  }

  onQuantityBlur(event: any) {
    const newQuantity = parseInt(event.target.value, 10);
    this.validateAndUpdateQuantity(newQuantity);
  }

  private validateAndUpdateQuantity(quantity: number) {
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    } else if (quantity > this.item.product.stock) {
      quantity = this.item.product.stock;
    } else if (quantity > 99) {
      quantity = 99;
    }

    if (quantity !== this.currentQuantity) {
      this.updateQuantity(quantity);
    }
  }

  private updateQuantity(quantity: number) {
    this.currentQuantity = quantity;
    this.quantityChange.emit({
      cartItemId: this.item.id,
      quantity: quantity
    });
  }

  onRemove() {
    this.remove.emit(this.item.id);
  }

  onSaveForLater() {
    this.saveForLater.emit(this.item);
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/no-image.svg';
  }
}
