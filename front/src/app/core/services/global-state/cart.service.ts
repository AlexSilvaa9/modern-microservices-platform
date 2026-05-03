import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    private readonly CART_URL = 'http://localhost:8083/api/cart';
    private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = computed(() => this.itemsSignal());
  readonly itemCount = computed(() => this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );
  readonly shipping = computed(() => (this.subtotal() > 80 ? 0 : 7.9));
  readonly total = computed(() => this.subtotal() + this.shipping());

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  increaseQuantity(itemId: string): void {
    // backend exposes an add endpoint that increases quantity by 1
    this.http.get(`${this.CART_URL}/add/${itemId}`).subscribe({
      next: () => this.loadCart(),
      error: () => this.loadCart()
    });
  }

  decreaseQuantity(itemId: string): void {
   this.http.get(`${this.CART_URL}/delete/${itemId}?quantity=1`).subscribe({
      next: () => this.loadCart(),
      error: () => this.loadCart()
    });
  }

  removeItem(itemId: string): void {

    this.http.get(`${this.CART_URL}/delete/${itemId}?quantity=1000`).subscribe({
      next: () => this.loadCart(),
      error: () => this.loadCart()
    });
  }

  addItem(item: CartItem): void {
    // backend provides add by productId (increments by 1), call repeatedly for quantity
    const calls: Array<Promise<any>> = [];
    for (let i = 0; i < item.quantity; i++) {
      calls.push(this.http.get(`${this.CART_URL}/add/${item.product.productId}`).toPromise());
    }
    Promise.all(calls)
      .then(() => this.loadCart())
      .catch(() => this.loadCart());
  }

  clearCart(): void {
    this.http.delete(`${this.CART_URL}`).subscribe({
      next: () => this.loadCart(),
      error: () => this.loadCart()
    });
  }

  public loadCart(): void {
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
      },
      error: () => {
        // keep local state unchanged on error
      }
    });
  }
}