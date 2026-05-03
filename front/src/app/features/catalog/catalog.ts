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

  private readonly pageSize = 6;
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

  addToCart(product: Product): void {
    if (!this.userStateService.getCurrentUserValue()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.cartService.addItem({
      product,
      quantity: 1
    });
  }

  trackByProductId(index: number, item: Product): string {
    return item.productId;
  }

  retry(): void {
    this.catalogService.refreshProducts();
  }
}
