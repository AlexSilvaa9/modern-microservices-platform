import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../models/cart.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_URL = 'http://localhost:8080/api/cart/';
  private readonly STORAGE_KEY = 'microservices-template.cart';
  private readonly itemsSignal = signal<CartItem[]>([]);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly errorService = inject(ErrorService);

  readonly items = computed(() => this.itemsSignal());
  readonly itemCount = computed(() => this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  increaseQuantity(itemId: string): void {
    this.patchLocalQuantity(itemId, 1);
    this.http.get(`${this.CART_URL}add/${itemId}`).subscribe();
  }

  decreaseQuantity(itemId: string): void {
    this.patchLocalQuantity(itemId, -1);
    this.http.get(`${this.CART_URL}delete/${itemId}?quantity=1`).subscribe();
  }

  removeItem(itemId: string): void {
    this.removeLocalItem(itemId);
    this.http.get(`${this.CART_URL}delete/${itemId}?quantity=1000`).subscribe();
  }

  addItem(item: CartItem): void {
    this.upsertLocalItem(item);

    for (let i = 0; i < item.quantity; i++) {
      this.http.get(`${this.CART_URL}add/${item.product.productId}`).subscribe();
    }
  }

  clearCart(): void {
    this.itemsSignal.set([]);
    this.persistCart([]);
    this.http.delete(`${this.CART_URL}`).subscribe();
  }

  clearLocalCart(): void {
    this.itemsSignal.set([]);
    this.persistCart([]);
  }

  public loadCart(): void {
    if (!this.isBrowser) {
      return;
    }

    this.http.get<any>(this.CART_URL).subscribe({
      next: (resp) => {
        // BaseApiResponse<ShoppingCartDTO> -> { message, data }
        const payload = resp?.data ?? resp;
        const items: CartItem[] = (payload?.items || []).map((it: any) => ({
          product: {
            productId: it?.product?.id ?? it?.productId,
            name: it?.product?.name ?? '',
            description: it?.product?.description ?? '',
            price: typeof it?.product?.price === 'string' ? parseFloat(it.product.price) : (it?.product?.price ?? 0),
            imageUrl: it?.product?.imageUrl ?? '',
            category: it?.product?.category ?? ''
          },
          quantity: it?.quantity ?? 0
        }));
        this.itemsSignal.set(items);
        this.persistCart(items);
      
      }
    });
  }

  private persistCart(items: CartItem[]): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private upsertLocalItem(item: CartItem): void {
    const currentItems = this.itemsSignal();
    const existingItem = currentItems.find((current) => current.product.productId === item.product.productId);

    let nextItems: CartItem[];
    if (existingItem) {
      nextItems = currentItems.map((current) =>
        current.product.productId === item.product.productId
          ? { ...current, quantity: current.quantity + item.quantity }
          : current
      );
    } else {
      nextItems = [...currentItems, item];
    }

    this.itemsSignal.set(nextItems);
    this.persistCart(nextItems);
  }

  private patchLocalQuantity(itemId: string, delta: number): void {
    const nextItems = this.itemsSignal()
      .map((item) =>
        item.product.productId === itemId
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
      .filter((item) => item.quantity > 0);

    this.itemsSignal.set(nextItems);
    this.persistCart(nextItems);
  }

  private removeLocalItem(itemId: string): void {
    const nextItems = this.itemsSignal().filter((item) => item.product.productId !== itemId);
    this.itemsSignal.set(nextItems);
    this.persistCart(nextItems);
  }
}