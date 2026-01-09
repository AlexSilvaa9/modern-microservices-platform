import { Injectable } from '@angular/core';
import { Observable, map, of, catchError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Product, ProductFilter, ProductResponse } from '../../../shared/models';
import { MockDataService } from '../../../shared/services/mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly endpoint = '/catalog/products';

  constructor(
    private apiService: ApiService,
    private mockDataService: MockDataService
  ) {}

  getProducts(filter?: ProductFilter, page = 0, size = 20): Observable<ProductResponse> {
    let params = new HttpParams();

    // Backend no parece tener paginación implementada, simulamos la respuesta
    if (filter) {
      if (filter.category) {
        // Para filtro por categoría, usar endpoint específico
        return this.getProductsByCategory(filter.category, page, size);
      }
      if (filter.search) {
        // Para búsqueda, usar endpoint específico
        return this.searchProducts(filter.search, page, size);
      }
    }

    // Obtener todos los productos
    return this.apiService.get<Product[]>(this.endpoint, params).pipe(
      map(products => this.createPaginatedResponse(products, page, size)),
      catchError(() => {
        // Fallback a datos mock si el backend no está disponible
        const mockProducts = this.mockDataService.getMockProducts();
        return of(this.createPaginatedResponse(this.applyFilters(mockProducts, filter), page, size));
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`${this.endpoint}/${id}`).pipe(
      catchError(() => {
        // Fallback a datos mock
        const mockProducts = this.mockDataService.getMockProducts();
        const product = mockProducts.find(p => p.id === id);
        return product ? of(product) : of({} as Product);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.apiService.get<string[]>(`${this.endpoint}/categories`).pipe(
      catchError(() => {
        // Fallback a datos mock
        return of(this.mockDataService.getMockCategories());
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    // El backend no tiene endpoint específico para productos destacados
    // Simulamos tomando los primeros productos
    return this.apiService.get<Product[]>(this.endpoint).pipe(
      map(products => products.slice(0, 8)),
      catchError(() => {
        // Fallback a datos mock
        const mockProducts = this.mockDataService.getMockProducts();
        return of(mockProducts.slice(0, 8));
      })
    );
  }

  searchProducts(query: string, page = 0, size = 20): Observable<ProductResponse> {
    const params = new HttpParams().set('name', query);
    
    return this.apiService.get<Product[]>(`${this.endpoint}/search`, params).pipe(
      map(products => this.createPaginatedResponse(products, page, size)),
      catchError(() => {
        // Fallback a datos mock
        const mockProducts = this.mockDataService.getMockProducts();
        const filtered = mockProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        );
        return of(this.createPaginatedResponse(filtered, page, size));
      })
    );
  }

  getProductsByCategory(category: string, page = 0, size = 20): Observable<ProductResponse> {
    return this.apiService.get<Product[]>(`${this.endpoint}/category/${category}`).pipe(
      map(products => this.createPaginatedResponse(products, page, size)),
      catchError(() => {
        // Fallback a datos mock
        const mockProducts = this.mockDataService.getMockProducts();
        const filtered = mockProducts.filter(p => p.category === category);
        return of(this.createPaginatedResponse(filtered, page, size));
      })
    );
  }

  private applyFilters(products: Product[], filter?: ProductFilter): Product[] {
    if (!filter) return products;

    return products.filter(product => {
      if (filter.category && product.category !== filter.category) return false;
      if (filter.minPrice && product.price < filter.minPrice) return false;
      if (filter.maxPrice && product.price > filter.maxPrice) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchLower) ||
                            product.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    }).sort((a, b) => {
      if (!filter.sortBy) return 0;
      
      let comparison = 0;
      switch (filter.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }
      
      return filter.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private createPaginatedResponse(products: Product[], page: number, size: number): ProductResponse {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      total: products.length,
      page: page,
      pageSize: size,
      totalPages: Math.ceil(products.length / size)
    };
  }
}
