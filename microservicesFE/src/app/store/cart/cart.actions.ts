import { createAction, props } from '@ngrx/store';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, CartSummary } from '../../shared/models';

// Load Cart
export const loadCart = createAction(
  '[Cart] Load Cart'
);

export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ cart: Cart }>()
);

export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);

// Add to Cart
export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ request: AddToCartRequest }>()
);

export const addToCartSuccess = createAction(
  '[Cart] Add To Cart Success',
  props<{ cart: Cart }>()
);

export const addToCartFailure = createAction(
  '[Cart] Add To Cart Failure',
  props<{ error: string }>()
);

// Update Cart Item
export const updateCartItem = createAction(
  '[Cart] Update Cart Item',
  props<{ request: UpdateCartItemRequest }>()
);

export const updateCartItemSuccess = createAction(
  '[Cart] Update Cart Item Success',
  props<{ cart: Cart }>()
);

export const updateCartItemFailure = createAction(
  '[Cart] Update Cart Item Failure',
  props<{ error: string }>()
);

// Remove from Cart
export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ cartItemId: string }>()
);

export const removeFromCartSuccess = createAction(
  '[Cart] Remove From Cart Success',
  props<{ cart: Cart }>()
);

export const removeFromCartFailure = createAction(
  '[Cart] Remove From Cart Failure',
  props<{ error: string }>()
);

// Clear Cart
export const clearCart = createAction(
  '[Cart] Clear Cart'
);

export const clearCartSuccess = createAction(
  '[Cart] Clear Cart Success'
);

export const clearCartFailure = createAction(
  '[Cart] Clear Cart Failure',
  props<{ error: string }>()
);

// Load Cart Summary
export const loadCartSummary = createAction(
  '[Cart] Load Cart Summary'
);

export const loadCartSummarySuccess = createAction(
  '[Cart] Load Cart Summary Success',
  props<{ summary: CartSummary }>()
);

export const loadCartSummaryFailure = createAction(
  '[Cart] Load Cart Summary Failure',
  props<{ error: string }>()
);

// Validate Cart
export const validateCart = createAction(
  '[Cart] Validate Cart'
);

export const validateCartSuccess = createAction(
  '[Cart] Validate Cart Success',
  props<{ cart: Cart }>()
);

export const validateCartFailure = createAction(
  '[Cart] Validate Cart Failure',
  props<{ error: string }>()
);
