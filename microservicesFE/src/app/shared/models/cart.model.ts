import { Product } from './product.model';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}
