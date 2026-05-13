import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CatalogService } from '../../core/services/api/catalog.service';
import { CartService } from '../../core/services/global-state/cart.service';
import { UserStateService } from '../../core/services/global-state/user-state.service';
import { Product } from '../../core/models/product.model';
import { computed, signal } from '@angular/core';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Catalog implements OnInit {
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private userStateService = inject(UserStateService);
  private router = inject(Router);

  private readonly pageSize = 8;
  readonly currentPage = signal(1);

  products = this.catalogService.products;
  isLoading = this.catalogService.isLoading;
  error = this.catalogService.error;
  readonly totalItems = computed(() => this.products().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize)));
  readonly pagedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.products().slice(startIndex, startIndex + this.pageSize);
  });
  readonly pageStart = computed(() => (this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1));
  readonly pageEnd = computed(() => Math.min(this.currentPage() * this.pageSize, this.totalItems()));
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));

  ngOnInit(): void {
    this.catalogService.refreshProducts();
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  goToPage(page: number): void {
    const nextPage = Math.min(Math.max(page, 1), this.totalPages());
    this.currentPage.set(nextPage);
  }

  trackByPage(index: number, item: number): number {
    return item;
  }

  addToCart(product: Product, event: Event): void {
    if (!this.userStateService.getCurrentUserValue()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const button = event.target as HTMLElement;
    this.animateToCart(button);

    this.cartService.addItem({
      product,
      quantity: 1
    });
  }

  private animateToCart(button: HTMLElement): void {
    const rect = button.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    // Create elegant light trail effect
    const lightTrail = document.createElement('div');
    lightTrail.style.position = 'fixed';
    lightTrail.style.left = startX + 'px';
    lightTrail.style.top = startY + 'px';
    lightTrail.style.width = '12px';
    lightTrail.style.height = '12px';
    lightTrail.style.borderRadius = '50%';
    lightTrail.style.pointerEvents = 'none';
    lightTrail.style.zIndex = '10000';
    lightTrail.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.95) 0%, rgba(99, 102, 241, 0.4) 100%)';
    lightTrail.style.boxShadow = '0 0 24px rgba(99, 102, 241, 1), 0 0 48px rgba(99, 102, 241, 0.7), 0 0 72px rgba(99, 102, 241, 0.4)';
    lightTrail.style.transform = 'translate(-50%, -50%)';
    lightTrail.style.opacity = '1';
    
    document.body.appendChild(lightTrail);
    
    // Animate to cart
    const duration = 1000;
    const startTime = Date.now();
    
    // Find cart icon position dynamically
    const cartIcon = document.querySelector('.cart-icon') as HTMLElement;
    let targetX = window.innerWidth - 40;
    let targetY = 40;
    
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      targetX = cartRect.left + cartRect.width / 2;
      targetY = cartRect.top + cartRect.height / 2;
    }
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-in-out
      const t = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentX = startX + (targetX - startX) * t;
      const currentY = startY + (targetY - startY) * t;
      
      lightTrail.style.left = currentX + 'px';
      lightTrail.style.top = currentY + 'px';
      
      // Keep opacity high until the end
      lightTrail.style.opacity = String(Math.max(0.7, 1 - progress * 0.3));
      
      // Glow intensifies significantly as it approaches
      const glowStrength = progress * 0.8;
      lightTrail.style.boxShadow = `0 0 ${24 + glowStrength * 32}px rgba(99, 102, 241, ${1 + glowStrength * 0.1}), 0 0 ${48 + glowStrength * 64}px rgba(99, 102, 241, ${0.7 + glowStrength * 0.3}), 0 0 ${72 + glowStrength * 96}px rgba(99, 102, 241, ${0.4 + glowStrength * 0.2})`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        lightTrail.style.transition = 'opacity 0.2s ease-out';
        lightTrail.style.opacity = '0';
        setTimeout(() => lightTrail.remove(), 200);
      }
    };
    
    requestAnimationFrame(animate);
  }
  

  trackByProductId(index: number, item: Product): string {
    return item.productId;
  }

  retry(): void {
    this.catalogService.refreshProducts();
  }
}
