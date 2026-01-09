import { createReducer, on } from '@ngrx/store';
import { Cart, CartSummary } from '../../shared/models';
import * as CartActions from './cart.actions';

export interface CartState {
  cart: Cart | null;
  summary: CartSummary | null;
  loading: boolean;
  error: string | null;
}

export const initialState: CartState = {
  cart: null,
  summary: null,
  loading: false,
  error: null
};

export const cartReducer = createReducer(
  initialState,

  // Load Cart
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.loadCartSuccess, (state, { cart }) => ({
    ...state,
    loading: false,
    cart
  })),

  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add to Cart
  on(CartActions.addToCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.addToCartSuccess, (state, { cart }) => ({
    ...state,
    loading: false,
    cart
  })),

  on(CartActions.addToCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Cart Item
  on(CartActions.updateCartItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.updateCartItemSuccess, (state, { cart }) => ({
    ...state,
    loading: false,
    cart
  })),

  on(CartActions.updateCartItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Remove from Cart
  on(CartActions.removeFromCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.removeFromCartSuccess, (state, { cart }) => ({
    ...state,
    loading: false,
    cart
  })),

  on(CartActions.removeFromCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear Cart
  on(CartActions.clearCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.clearCartSuccess, (state) => ({
    ...state,
    loading: false,
    cart: null,
    summary: null
  })),

  on(CartActions.clearCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Cart Summary
  on(CartActions.loadCartSummary, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.loadCartSummarySuccess, (state, { summary }) => ({
    ...state,
    loading: false,
    summary
  })),

  on(CartActions.loadCartSummaryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Validate Cart
  on(CartActions.validateCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.validateCartSuccess, (state, { cart }) => ({
    ...state,
    loading: false,
    cart
  })),

  on(CartActions.validateCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
