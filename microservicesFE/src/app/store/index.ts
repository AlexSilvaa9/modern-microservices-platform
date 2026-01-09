import { CatalogState } from './catalog/catalog.reducer';
import { CartState } from './cart/cart.reducer';

export interface AppState {
  catalog: CatalogState;
  cart: CartState;
}

export * from './catalog/catalog.actions';
export { catalogReducer } from './catalog/catalog.reducer';
export type { CatalogState } from './catalog/catalog.reducer';
export * from './catalog/catalog.effects';
export * from './catalog/catalog.selectors';

export * from './cart/cart.actions';
export { cartReducer } from './cart/cart.reducer';
export type { CartState } from './cart/cart.reducer';
export * from './cart/cart.effects';
export * from './cart/cart.selectors';
