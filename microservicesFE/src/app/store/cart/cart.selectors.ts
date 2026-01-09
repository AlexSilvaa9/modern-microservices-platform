import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCart = createSelector(
  selectCartState,
  (state: CartState) => state.cart
);

export const selectCartItems = createSelector(
  selectCart,
  (cart) => cart?.items || []
);

export const selectCartItemCount = createSelector(
  selectCart,
  (cart) => cart?.itemCount || 0
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart) => cart?.total || 0
);

export const selectCartSummary = createSelector(
  selectCartState,
  (state: CartState) => state.summary
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state: CartState) => state.error
);

export const selectIsProductInCart = (productId: string) => createSelector(
  selectCartItems,
  (items) => items.some(item => item.product.id === productId)
);

export const selectCartItemByProductId = (productId: string) => createSelector(
  selectCartItems,
  (items) => items.find(item => item.product.id === productId)
);
