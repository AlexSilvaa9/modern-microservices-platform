import { Injectable } from '@angular/core';
import { Observable, map, of, catchError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, CartSummary, Product } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly endpoint = '/cart';
  private readonly defaultUserId = 'user123'; // Simulamos un usuario por defecto
  private mockCart: Cart = this.createEmptyCart();

  constructor(private apiService: ApiService) {}

  getCart(): Observable<Cart> {
    return this.apiService.get<any>(`${this.endpoint}/${this.defaultUserId}`).pipe(
      map(cartDto => this.mapToCart(cartDto)),
      catchError(() => {
        // Fallback a datos mock
        return of(this.mockCart);
      })
    );
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    const cartItemDto = {
      productId: parseInt(request.productId),
      quantity: request.quantity,
      productName: '', // Will be filled by backend
      price: 0 // Will be filled by backend
    };

    return this.apiService.post<any>(`${this.endpoint}/${this.defaultUserId}/items`, cartItemDto).pipe(
      map(cartDto => this.mapToCart(cartDto)),
      catchError(() => {
        // Fallback a datos mock
        this.addToMockCart(request);
        return of(this.mockCart);
      })
    );
  }

  updateCartItem(request: UpdateCartItemRequest): Observable<Cart> {
    // El backend no tiene un endpoint específico para actualizar, 
    // tendríamos que implementarlo o simular eliminando y agregando
    return this.removeFromCart(request.cartItemId).pipe(
      map(cart => cart),
      catchError(() => {
        // Fallback a datos mock
        this.updateMockCartItem(request);
        return of(this.mockCart);
      })
    );
  }

  removeFromCart(cartItemId: string): Observable<Cart> {
    return this.apiService.delete<any>(`${this.endpoint}/${this.defaultUserId}/items/${cartItemId}`).pipe(
      map(cartDto => this.mapToCart(cartDto)),
      catchError(() => {
        // Fallback a datos mock
        this.removeFromMockCart(cartItemId);
        return of(this.mockCart);
      })
    );
  }

  clearCart(): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${this.defaultUserId}`).pipe(
      catchError(() => {
        // Fallback a datos mock
        this.mockCart = this.createEmptyCart();
        return of(void 0);
      })
    );
  }

  getCartSummary(): Observable<CartSummary> {
    return this.getCart().pipe(
      map(cart => this.calculateSummary(cart))
    );
  }

  getCartItemCount(): Observable<number> {
    return this.getCart().pipe(
      map(cart => cart.itemCount)
    );
  }

  validateCart(): Observable<Cart> {
    // El backend no tiene endpoint específico para validar
    return this.getCart();
  }

  private mapToCart(cartDto: any): Cart {
    if (!cartDto) {
      return {
        id: '',
        userId: this.defaultUserId,
        items: [],
        total: 0,
        itemCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    const items: CartItem[] = (cartDto.items || []).map((item: any) => ({
      id: item.id?.toString() || '',
      product: {
        id: item.productId?.toString() || '',
        name: item.productName || '',
        description: '',
        price: item.price || 0,
        imageUrl: '',
        category: '',
        stock: 0
      },
      quantity: item.quantity || 0,
      subtotal: (item.price || 0) * (item.quantity || 0),
      addedAt: new Date()
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cartDto.id?.toString() || '',
      userId: cartDto.userId || this.defaultUserId,
      items: items,
      total: total,
      itemCount: itemCount,
      createdAt: cartDto.createdAt ? new Date(cartDto.createdAt) : new Date(),
      updatedAt: cartDto.updatedAt ? new Date(cartDto.updatedAt) : new Date()
    };
  }

  private calculateSummary(cart: Cart): CartSummary {
    const subtotal = cart.total;
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount: cart.itemCount
    };
  }

  private createEmptyCart(): Cart {
    return {
      id: 'mock-cart-1',
      userId: this.defaultUserId,
      items: [],
      total: 0,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private addToMockCart(request: AddToCartRequest): void {
    const existingItem = this.mockCart.items.find(item => item.product.id === request.productId);
    
    if (existingItem) {
      existingItem.quantity += request.quantity;
      existingItem.subtotal = existingItem.product.price * existingItem.quantity;
    } else {
      // Crear un producto mock básico
      const mockProduct: Product = {
        id: request.productId,
        name: `Producto ${request.productId}`,
        description: 'Descripción del producto',
        price: 25.99,
        imageUrl: '/placeholder.jpg',
        category: 'General',
        stock: 100
      };

      const newItem: CartItem = {
        id: `mock-item-${Date.now()}`,
        product: mockProduct,
        quantity: request.quantity,
        subtotal: mockProduct.price * request.quantity,
        addedAt: new Date()
      };
      this.mockCart.items.push(newItem);
    }
    
    this.updateMockCartTotals();
  }

  private updateMockCartItem(request: UpdateCartItemRequest): void {
    const item = this.mockCart.items.find(item => item.id === request.cartItemId);
    if (item) {
      if (request.quantity <= 0) {
        this.removeFromMockCart(request.cartItemId);
      } else {
        item.quantity = request.quantity;
        item.subtotal = item.product.price * request.quantity;
        this.updateMockCartTotals();
      }
    }
  }

  private removeFromMockCart(cartItemId: string): void {
    this.mockCart.items = this.mockCart.items.filter(item => item.id !== cartItemId);
    this.updateMockCartTotals();
  }

  private updateMockCartTotals(): void {
    this.mockCart.total = this.mockCart.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.mockCart.itemCount = this.mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.mockCart.updatedAt = new Date();
  }
}
