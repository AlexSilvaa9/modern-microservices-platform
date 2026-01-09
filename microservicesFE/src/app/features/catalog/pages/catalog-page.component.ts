import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '../../../store';
import { 
  selectProducts, 
  selectCategories, 
  selectCatalogLoading, 
  selectCatalogError, 
  selectPagination,
  selectFilter
} from '../../../store/catalog/catalog.selectors';
import { 
  loadProducts, 
  loadCategories, 
  setFilter, 
  clearFilter 
} from '../../../store/catalog/catalog.actions';
import { addToCart } from '../../../store/cart/cart.actions';

import { Product, ProductFilter } from '../../../shared/models';
import { ProductCardComponent } from '../components/product-card.component';
import { ProductFilterComponent } from '../components/product-filter.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterComponent],
  template: `
    <div class="catalog-page">
      <div class="container-fluid">
        <!-- Page Header -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="page-header">
              <h1 class="page-title">
                <i class="bi bi-grid me-2"></i>
                Catálogo de Productos
              </h1>
              <p class="page-description text-muted">
                Explora nuestra amplia selección de productos
              </p>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="row mb-4">
          <div class="col-12">
            <app-product-filter
              [categories]="(categories$ | async) || []"
              [currentFilter]="(currentFilter$ | async) || {}"
              [totalProducts]="(pagination$ | async)?.total || 0"
              (filterChange)="onFilterChange($event)"
              (clearFilter)="onClearFilter()">
            </app-product-filter>
          </div>
        </div>

        <!-- Loading State -->
        <div class="row" *ngIf="loading$ | async">
          <div class="col-12">
            <div class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando productos...</span>
              </div>
              <p class="mt-3 text-muted">Cargando productos...</p>
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

        <!-- Products Grid -->
        <div class="row" *ngIf="!(loading$ | async) && !(error$ | async)">
          <div class="col-12">
            <!-- Results Summary -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="results-info">
                <span class="text-muted">
                  Mostrando 
                  <strong>{{ products.length }}</strong> 
                  de 
                  <strong>{{ (pagination$ | async)?.total || 0 }}</strong> 
                  productos
                </span>
              </div>
              <div class="view-options">
                <div class="btn-group btn-group-sm" role="group">
                  <input type="radio" class="btn-check" name="viewMode" id="gridView" autocomplete="off" checked>
                  <label class="btn btn-outline-secondary" for="gridView">
                    <i class="bi bi-grid-3x3-gap"></i>
                  </label>
                  <input type="radio" class="btn-check" name="viewMode" id="listView" autocomplete="off">
                  <label class="btn btn-outline-secondary" for="listView">
                    <i class="bi bi-list"></i>
                  </label>
                </div>
              </div>
            </div>

            <!-- Products -->
            <div class="products-grid" *ngIf="products.length > 0; else noProducts">
              <div class="row g-4">
                <div class="col-xl-3 col-lg-4 col-md-6" *ngFor="let product of products; trackBy: trackByProductId">
                  <app-product-card
                    [product]="product"
                    (productClick)="onProductClick($event)"
                    (addToCart)="onAddToCart($event)">
                  </app-product-card>
                </div>
              </div>
            </div>

            <!-- No Products -->
            <ng-template #noProducts>
              <div class="no-products text-center py-5">
                <i class="bi bi-inbox display-1 text-muted"></i>
                <h3 class="mt-3">No se encontraron productos</h3>
                <p class="text-muted mb-4">
                  Intenta modificar los filtros o realiza una búsqueda diferente
                </p>
                <button class="btn btn-primary" (click)="onClearFilter()">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Limpiar filtros
                </button>
              </div>
            </ng-template>

            <!-- Pagination -->
            <div class="row mt-5" *ngIf="(pagination$ | async)?.totalPages as totalPages">
              <div class="col-12" *ngIf="totalPages > 1">
                <nav aria-label="Navegación de productos">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" [class.disabled]="currentPage === 0">
                      <a class="page-link" (click)="onPageChange(currentPage - 1)" [attr.aria-disabled]="currentPage === 0">
                        <i class="bi bi-chevron-left"></i>
                        Anterior
                      </a>
                    </li>
                    
                    <li *ngFor="let page of getVisiblePages()" 
                        class="page-item" 
                        [class.active]="page === currentPage">
                      <a class="page-link" (click)="onPageChange(page)">{{ page + 1 }}</a>
                    </li>
                    
                    <li class="page-item" [class.disabled]="currentPage >= totalPages - 1">
                      <a class="page-link" (click)="onPageChange(currentPage + 1)" [attr.aria-disabled]="currentPage >= totalPages - 1">
                        Siguiente
                        <i class="bi bi-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-page {
      min-height: calc(100vh - 200px);
    }

    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .page-description {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
    }

    .products-grid .row {
      margin: 0 -0.75rem;
    }

    .products-grid .col-xl-3,
    .products-grid .col-lg-4,
    .products-grid .col-md-6 {
      padding: 0 0.75rem;
    }

    .results-info {
      font-size: 0.95rem;
    }

    .view-options label {
      width: 40px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .no-products {
      padding: 4rem 2rem;
    }

    .no-products i {
      font-size: 4rem;
    }

    .pagination .page-link {
      border: none;
      color: #6c757d;
      background: transparent;
      padding: 0.75rem 1rem;
      margin: 0 2px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .pagination .page-link:hover {
      background-color: #e9ecef;
      color: #495057;
    }

    .pagination .page-item.active .page-link {
      background-color: #007bff;
      color: white;
      box-shadow: 0 2px 4px rgba(0,123,255,0.3);
    }

    .pagination .page-item.disabled .page-link {
      opacity: 0.5;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .page-header {
        padding: 2rem 1rem;
      }
      
      .page-title {
        font-size: 2rem;
      }
      
      .results-info,
      .view-options {
        text-align: center;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class CatalogPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  products: Product[] = [];
  currentPage = 0;
  pageSize = 20;

  // Observables
  products$!: Observable<Product[]>;
  categories$!: Observable<string[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  pagination$!: Observable<any>;
  currentFilter$!: Observable<ProductFilter>;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeObservables();
    this.loadInitialData();
    this.subscribeToProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeObservables() {
    this.products$ = this.store.select(selectProducts);
    this.categories$ = this.store.select(selectCategories);
    this.loading$ = this.store.select(selectCatalogLoading);
    this.error$ = this.store.select(selectCatalogError);
    this.pagination$ = this.store.select(selectPagination);
    this.currentFilter$ = this.store.select(selectFilter);
  }

  private loadInitialData() {
    // Load categories and initial products
    this.store.dispatch(loadCategories());
    this.store.dispatch(loadProducts({ 
      page: this.currentPage, 
      size: this.pageSize 
    }));
  }

  private subscribeToProducts() {
    this.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });

    this.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe(pagination => {
        if (pagination) {
          this.currentPage = pagination.page;
        }
      });
  }

  onFilterChange(filter: ProductFilter) {
    this.store.dispatch(setFilter({ filter }));
    this.store.dispatch(loadProducts({ 
      filter, 
      page: 0, 
      size: this.pageSize 
    }));
  }

  onClearFilter() {
    this.store.dispatch(clearFilter());
    this.store.dispatch(loadProducts({ 
      page: 0, 
      size: this.pageSize 
    }));
  }

  onProductClick(product: Product) {
    this.router.navigate(['/catalog/product', product.id]);
  }

  onAddToCart(product: Product) {
    this.store.dispatch(addToCart({ 
      request: { productId: product.id, quantity: 1 } 
    }));
  }

  onPageChange(page: number) {
    if (page >= 0) {
      this.currentPage = page;
      this.store.dispatch(loadProducts({ 
        page, 
        size: this.pageSize 
      }));
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  retryLoad() {
    this.loadInitialData();
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    
    // Get total pages from pagination observable synchronously
    let totalPages = 0;
    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe(pagination => {
      totalPages = pagination?.totalPages || 0;
    });
    
    if (totalPages <= 1) return pages;
    
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
