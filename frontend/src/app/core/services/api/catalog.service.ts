import { Injectable } from '@angular/core';
import { signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { Page } from '../../models/page.model';
import { BaseApiResponse } from '../../models/user.model';
import { ErrorService } from '../global-state/error.service';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = environment.apiUrl;
  private loadProductsUrl = `${this.apiUrl}product/getProducts`;
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
  public products = signal<Product[]>([]);
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  private loadProducts() {
    this.isLoading.set(true);
    this.error.set(null);
    const params = { page: '0', size: '100' };
    this.http.get<BaseApiResponse<Page<Product>>>(this.loadProductsUrl, { params }).subscribe({
      next: (response) => {
        const raw = response.data?.content || [];
        const normalized = (raw as any[]).map(p => ({
          productId: p.productId ?? p.id ?? String(p?.uuid ?? ''),
          name: p.name ?? '',
          description: p.description ?? '',
          price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price ?? 0),
          imageUrl: p.imageUrl ?? p.image ?? '',
          category: p.category ?? ''
        }));
        this.products.set(normalized);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorService.showError({
          message: error.error?.message || 'Error loading products',
          errors: error.error?.errors,
          timestamp: error.error?.timestamp
        });
        this.error.set(error.message || 'Error cargando productos');
        this.products.set([]);
        this.isLoading.set(false);
      }
    });
  }

  getProductById(id: string) {
    return this.products().find(p => p.productId === id);
  }

  refreshProducts() {
    this.loadProducts();
  }
}
