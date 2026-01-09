import { createAction, props } from '@ngrx/store';
import { Product, ProductFilter, ProductResponse } from '../../shared/models';

// Load Products
export const loadProducts = createAction(
  '[Catalog] Load Products',
  props<{ filter?: ProductFilter; page?: number; size?: number }>()
);

export const loadProductsSuccess = createAction(
  '[Catalog] Load Products Success',
  props<{ response: ProductResponse }>()
);

export const loadProductsFailure = createAction(
  '[Catalog] Load Products Failure',
  props<{ error: string }>()
);

// Load Product by ID
export const loadProduct = createAction(
  '[Catalog] Load Product',
  props<{ id: string }>()
);

export const loadProductSuccess = createAction(
  '[Catalog] Load Product Success',
  props<{ product: Product }>()
);

export const loadProductFailure = createAction(
  '[Catalog] Load Product Failure',
  props<{ error: string }>()
);

// Load Categories
export const loadCategories = createAction(
  '[Catalog] Load Categories'
);

export const loadCategoriesSuccess = createAction(
  '[Catalog] Load Categories Success',
  props<{ categories: string[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Catalog] Load Categories Failure',
  props<{ error: string }>()
);

// Load Featured Products
export const loadFeaturedProducts = createAction(
  '[Catalog] Load Featured Products'
);

export const loadFeaturedProductsSuccess = createAction(
  '[Catalog] Load Featured Products Success',
  props<{ products: Product[] }>()
);

export const loadFeaturedProductsFailure = createAction(
  '[Catalog] Load Featured Products Failure',
  props<{ error: string }>()
);

// Search Products
export const searchProducts = createAction(
  '[Catalog] Search Products',
  props<{ query: string; page?: number; size?: number }>()
);

export const searchProductsSuccess = createAction(
  '[Catalog] Search Products Success',
  props<{ response: ProductResponse }>()
);

export const searchProductsFailure = createAction(
  '[Catalog] Search Products Failure',
  props<{ error: string }>()
);

// Filter Actions
export const setFilter = createAction(
  '[Catalog] Set Filter',
  props<{ filter: ProductFilter }>()
);

export const clearFilter = createAction(
  '[Catalog] Clear Filter'
);

// UI Actions
export const setSelectedProduct = createAction(
  '[Catalog] Set Selected Product',
  props<{ product: Product | null }>()
);

export const clearSelectedProduct = createAction(
  '[Catalog] Clear Selected Product'
);
