import { createReducer, on } from '@ngrx/store';
import { Product, ProductFilter } from '../../shared/models';
import * as CatalogActions from './catalog.actions';

export interface CatalogState {
  products: Product[];
  selectedProduct: Product | null;
  featuredProducts: Product[];
  categories: string[];
  filter: ProductFilter;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export const initialState: CatalogState = {
  products: [],
  selectedProduct: null,
  featuredProducts: [],
  categories: [],
  filter: {},
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 20,
    total: 0,
    totalPages: 0
  }
};

export const catalogReducer = createReducer(
  initialState,

  // Load Products
  on(CatalogActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CatalogActions.loadProductsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    products: response.products,
    pagination: {
      page: response.page,
      size: response.pageSize,
      total: response.total,
      totalPages: response.totalPages
    }
  })),

  on(CatalogActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Product
  on(CatalogActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CatalogActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    selectedProduct: product
  })),

  on(CatalogActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Categories
  on(CatalogActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CatalogActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    categories
  })),

  on(CatalogActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Featured Products
  on(CatalogActions.loadFeaturedProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CatalogActions.loadFeaturedProductsSuccess, (state, { products }) => ({
    ...state,
    loading: false,
    featuredProducts: products
  })),

  on(CatalogActions.loadFeaturedProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Search Products
  on(CatalogActions.searchProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CatalogActions.searchProductsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    products: response.products,
    pagination: {
      page: response.page,
      size: response.pageSize,
      total: response.total,
      totalPages: response.totalPages
    }
  })),

  on(CatalogActions.searchProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filter Actions
  on(CatalogActions.setFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter }
  })),

  on(CatalogActions.clearFilter, (state) => ({
    ...state,
    filter: {}
  })),

  // UI Actions
  on(CatalogActions.setSelectedProduct, (state, { product }) => ({
    ...state,
    selectedProduct: product
  })),

  on(CatalogActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProduct: null
  }))
);
