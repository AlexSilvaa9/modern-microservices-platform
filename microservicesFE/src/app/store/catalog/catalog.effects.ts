import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CatalogService } from '../../features/catalog/services/catalog.service';
import * as CatalogActions from './catalog.actions';

@Injectable()
export class CatalogEffects {
  constructor(
    private actions$: Actions,
    private catalogService: CatalogService
  ) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.loadProducts),
      switchMap(({ filter, page, size }) =>
        this.catalogService.getProducts(filter, page, size).pipe(
          map(response => CatalogActions.loadProductsSuccess({ response })),
          catchError(error => of(CatalogActions.loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.loadProduct),
      switchMap(({ id }) =>
        this.catalogService.getProductById(id).pipe(
          map(product => CatalogActions.loadProductSuccess({ product })),
          catchError(error => of(CatalogActions.loadProductFailure({ error: error.message })))
        )
      )
    )
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.loadCategories),
      switchMap(() =>
        this.catalogService.getCategories().pipe(
          map(categories => CatalogActions.loadCategoriesSuccess({ categories })),
          catchError(error => of(CatalogActions.loadCategoriesFailure({ error: error.message })))
        )
      )
    )
  );

  loadFeaturedProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.loadFeaturedProducts),
      switchMap(() =>
        this.catalogService.getFeaturedProducts().pipe(
          map(products => CatalogActions.loadFeaturedProductsSuccess({ products })),
          catchError(error => of(CatalogActions.loadFeaturedProductsFailure({ error: error.message })))
        )
      )
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.searchProducts),
      switchMap(({ query, page, size }) =>
        this.catalogService.searchProducts(query, page, size).pipe(
          map(response => CatalogActions.searchProductsSuccess({ response })),
          catchError(error => of(CatalogActions.searchProductsFailure({ error: error.message })))
        )
      )
    )
  );
}
