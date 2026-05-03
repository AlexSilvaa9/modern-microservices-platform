import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { Page } from '../../models/page.model';
import { BaseApiResponse } from '../../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = 'http://localhost:8080/api/product/';
  public products = signal<Product[]>([]);
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    this.isLoading.set(true);
    this.error.set(null);
    const params = { page: '0', size: '100' };
    this.http.get<BaseApiResponse<Page<Product>>>(this.apiUrl, { params }).subscribe({
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
        console.error('Error loading products:', error);
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
