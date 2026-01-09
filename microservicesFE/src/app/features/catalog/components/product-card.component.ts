import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../shared/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card h-100 product-card" (click)="onProductClick()">
      <div class="card-img-container">
        <img 
          [src]="product.imageUrl" 
          [alt]="product.name" 
          class="card-img-top"
          (error)="onImageError($event)">
        <div class="product-overlay">
          <button 
            class="btn btn-primary btn-sm"
            (click)="onAddToCart($event)"
            [disabled]="product.stock <= 0">
            <i class="bi bi-cart-plus me-1"></i>
            {{ product.stock <= 0 ? 'Sin stock' : 'Agregar' }}
          </button>
        </div>
      </div>
      
      <div class="card-body d-flex flex-column">
        <div class="mb-2">
          <span class="badge bg-secondary text-uppercase">{{ product.category }}</span>
        </div>
        
        <h5 class="card-title">{{ product.name }}</h5>
        <p class="card-text flex-grow-1">{{ product.description | slice:0:100 }}{{ product.description.length > 100 ? '...' : '' }}</p>
        
        <div class="product-info mt-auto">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="price fw-bold text-primary fs-5">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</span>
            <small class="text-muted">Stock: {{ product.stock }}</small>
          </div>
          
          <div class="d-flex justify-content-between align-items-center" *ngIf="product.rating">
            <div class="rating">
              <span *ngFor="let star of getStars(product.rating)" class="star" [ngClass]="star">
                <i class="bi bi-star-fill"></i>
              </span>
            </div>
            <small class="text-muted" *ngIf="product.reviews">({{ product.reviews }} reviews)</small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid #e0e0e0;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-color: #007bff;
    }

    .card-img-container {
      position: relative;
      overflow: hidden;
      height: 250px;
    }

    .card-img-top {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .card-img-top {
      transform: scale(1.05);
    }

    .product-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .product-overlay {
      opacity: 1;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .card-text {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.4;
    }

    .price {
      font-size: 1.25rem !important;
    }

    .rating {
      display: flex;
      gap: 2px;
    }

    .star {
      color: #ddd;
      font-size: 0.9rem;
    }

    .star.filled {
      color: #ffc107;
    }

    .star.half {
      background: linear-gradient(90deg, #ffc107 50%, #ddd 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .badge {
      font-size: 0.7rem;
      letter-spacing: 0.5px;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();

  onProductClick() {
    this.productClick.emit(this.product);
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/no-image.svg';
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('filled');
    }
    
    if (hasHalfStar) {
      stars.push('half');
    }
    
    while (stars.length < 5) {
      stars.push('');
    }
    
    return stars;
  }
}
