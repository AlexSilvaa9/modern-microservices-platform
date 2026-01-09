import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CatalogState } from './catalog.reducer';

export const selectCatalogState = createFeatureSelector<CatalogState>('catalog');

export const selectProducts = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.products
);

export const selectSelectedProduct = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.selectedProduct
);

export const selectFeaturedProducts = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.featuredProducts
);

export const selectCategories = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.categories
);

export const selectFilter = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.filter
);

export const selectCatalogLoading = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.loading
);

export const selectCatalogError = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.error
);

export const selectPagination = createSelector(
  selectCatalogState,
  (state: CatalogState) => state.pagination
);

export const selectProductById = (id: string) => createSelector(
  selectProducts,
  (products) => products.find(product => product.id === id)
);

export const selectProductsByCategory = (category: string) => createSelector(
  selectProducts,
  (products) => products.filter(product => product.category === category)
);
