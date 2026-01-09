import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../store';
import { selectFeaturedProducts, selectCatalogLoading } from '../../store/catalog/catalog.selectors';
import { loadFeaturedProducts } from '../../store/catalog/catalog.actions';
import { addToCart } from '../../store/cart/cart.actions';

import { Product } from '../../shared/models';
import { ProductCardComponent } from '../catalog/components/product-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="row align-items-center min-vh-75">
            <div class="col-lg-6">
              <div class="hero-content">
                <h1 class="hero-title">
                  Bienvenido a 
                  <span class="brand-highlight">MicroStore</span>
                </h1>
                <p class="hero-description">
                  Descubre una experiencia de compra única con nuestra arquitectura de microservicios. 
                  Productos de calidad, entrega rápida y el mejor servicio al cliente.
                </p>
                <div class="hero-actions">
                  <a class="btn btn-primary btn-lg me-3" routerLink="/catalog">
                    <i class="bi bi-grid me-2"></i>
                    Explorar catálogo
                  </a>
                  <a class="btn btn-outline-secondary btn-lg" href="#featured">
                    <i class="bi bi-stars me-2"></i>
                    Ver destacados
                  </a>
                </div>
                
                <!-- Stats -->
                <div class="hero-stats mt-5">
                  <div class="row text-center">
                    <div class="col-4">
                      <div class="stat-item">
                        <div class="stat-number">1000+</div>
                        <div class="stat-label">Productos</div>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="stat-item">
                        <div class="stat-number">50k+</div>
                        <div class="stat-label">Clientes</div>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="stat-item">
                        <div class="stat-number">99%</div>
                        <div class="stat-label">Satisfacción</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="hero-image">
                <div class="image-container">
                  <div class="floating-card card-1">
                    <i class="bi bi-shield-check"></i>
                    <span>Compra segura</span>
                  </div>
                  <div class="floating-card card-2">
                    <i class="bi bi-truck"></i>
                    <span>Envío gratis</span>
                  </div>
                  <div class="floating-card card-3">
                    <i class="bi bi-headset"></i>
                    <span>Soporte 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section py-5 bg-light">
        <div class="container">
          <div class="row">
            <div class="col-12 text-center mb-5">
              <h2 class="section-title">¿Por qué elegir MicroStore?</h2>
              <p class="section-subtitle text-muted">
                Tecnología de vanguardia para una experiencia de compra excepcional
              </p>
            </div>
          </div>
          
          <div class="row g-4">
            <div class="col-md-4">
              <div class="feature-card text-center">
                <div class="feature-icon">
                  <i class="bi bi-lightning-charge"></i>
                </div>
                <h4>Rendimiento ultrarrápido</h4>
                <p class="text-muted">
                  Arquitectura de microservicios optimizada para velocidad y escalabilidad
                </p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="feature-card text-center">
                <div class="feature-icon">
                  <i class="bi bi-shield-lock"></i>
                </div>
                <h4>Máxima seguridad</h4>
                <p class="text-muted">
                  Protección de datos y transacciones con los más altos estándares de seguridad
                </p>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="feature-card text-center">
                <div class="feature-icon">
                  <i class="bi bi-cloud-check"></i>
                </div>
                <h4>Disponibilidad 24/7</h4>
                <p class="text-muted">
                  Sistema distribuido con alta disponibilidad y recuperación automática
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section id="featured" class="featured-section py-5">
        <div class="container">
          <div class="row">
            <div class="col-12 text-center mb-5">
              <h2 class="section-title">Productos destacados</h2>
              <p class="section-subtitle text-muted">
                Los productos más populares y mejor valorados por nuestros clientes
              </p>
            </div>
          </div>

          <!-- Loading State -->
          <div class="row" *ngIf="loading$ | async">
            <div class="col-12 text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando productos destacados...</span>
              </div>
            </div>
          </div>

          <!-- Featured Products -->
          <div class="row g-4" *ngIf="!(loading$ | async)">
            <div class="col-lg-3 col-md-6" *ngFor="let product of featuredProducts$ | async | slice:0:8">
              <app-product-card
                [product]="product"
                (productClick)="onProductClick($event)"
                (addToCart)="onAddToCart($event)">
              </app-product-card>
            </div>
          </div>

          <!-- View All Button -->
          <div class="row mt-5" *ngIf="!(loading$ | async)">
            <div class="col-12 text-center">
              <a class="btn btn-outline-primary btn-lg" routerLink="/catalog">
                Ver todos los productos
                <i class="bi bi-arrow-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter-section py-5 bg-primary text-white">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h3 class="mb-3">¡Mantente al día!</h3>
              <p class="mb-0">
                Suscríbete a nuestro newsletter y recibe las mejores ofertas y novedades directamente en tu email.
              </p>
            </div>
            <div class="col-lg-6">
              <div class="newsletter-form">
                <div class="input-group">
                  <input 
                    type="email" 
                    class="form-control" 
                    placeholder="Tu email aquí..."
                    #emailInput>
                  <button class="btn btn-light" type="button" (click)="subscribeNewsletter(emailInput.value)">
                    <i class="bi bi-envelope me-1"></i>
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      overflow-x: hidden;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="300" fill="url(%23a)"/><circle cx="800" cy="800" r="200" fill="url(%23a)"/></svg>');
      opacity: 0.1;
    }

    .min-vh-75 {
      min-height: 75vh;
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    .brand-highlight {
      background: linear-gradient(45deg, #ffd700, #ff8c00);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-stats {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-item {
      padding: 0.5rem;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #ffd700;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .hero-image {
      position: relative;
      height: 500px;
    }

    .image-container {
      position: relative;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      border-radius: 20px;
    }

    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      color: #333;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .floating-card i {
      font-size: 1.25rem;
      margin-right: 0.5rem;
      color: #007bff;
    }

    .card-1 {
      top: 20%;
      right: 10%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 50%;
      left: 5%;
      animation-delay: 2s;
    }

    .card-3 {
      bottom: 20%;
      right: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      padding: 2.5rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      height: 100%;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: white;
      font-size: 2rem;
    }

    .feature-card h4 {
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }

    .newsletter-section {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
    }

    .newsletter-form .form-control {
      border-radius: 25px 0 0 25px;
      border: none;
      padding: 0.75rem 1.25rem;
    }

    .newsletter-form .btn {
      border-radius: 0 25px 25px 0;
      padding: 0.75rem 1.5rem;
      border: none;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-description {
        font-size: 1.1rem;
      }
      
      .hero-actions {
        text-align: center;
      }
      
      .hero-actions .btn {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
      }
      
      .hero-image {
        margin-top: 3rem;
        height: 300px;
      }
      
      .floating-card {
        position: static;
        margin-bottom: 1rem;
        animation: none;
      }
      
      .section-title {
        font-size: 2rem;
      }
      
      .newsletter-form {
        margin-top: 2rem;
      }
    }
  `]
})
export class HomePageComponent implements OnInit {
  featuredProducts$!: Observable<Product[]>;
  loading$!: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.featuredProducts$ = this.store.select(selectFeaturedProducts);
    this.loading$ = this.store.select(selectCatalogLoading);
    
    // Load featured products
    this.store.dispatch(loadFeaturedProducts());
  }

  onProductClick(product: Product) {
    // Navigate to product detail (to be implemented)
    console.log('Product clicked:', product);
  }

  onAddToCart(product: Product) {
    this.store.dispatch(addToCart({ 
      request: { productId: product.id, quantity: 1 } 
    }));
  }

  subscribeNewsletter(email: string) {
    if (email) {
      // Implement newsletter subscription
      console.log('Subscribe to newsletter:', email);
    }
  }
}
