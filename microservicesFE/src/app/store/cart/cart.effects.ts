import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CartService } from '../../features/cart/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        this.cartService.getCart().pipe(
          map(cart => CartActions.loadCartSuccess({ cart })),
          catchError(error => of(CartActions.loadCartFailure({ error: error.message })))
        )
      )
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      switchMap(({ request }) =>
        this.cartService.addToCart(request).pipe(
          map(cart => {
            this.notificationService.success('Producto agregado al carrito');
            return CartActions.addToCartSuccess({ cart });
          }),
          catchError(error => {
            this.notificationService.error('Error al agregar producto al carrito');
            return of(CartActions.addToCartFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartItem),
      switchMap(({ request }) =>
        this.cartService.updateCartItem(request).pipe(
          map(cart => {
            this.notificationService.success('Carrito actualizado');
            return CartActions.updateCartItemSuccess({ cart });
          }),
          catchError(error => {
            this.notificationService.error('Error al actualizar el carrito');
            return of(CartActions.updateCartItemFailure({ error: error.message }));
          })
        )
      )
    )
  );

  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCart),
      switchMap(({ cartItemId }) =>
        this.cartService.removeFromCart(cartItemId).pipe(
          map(cart => {
            this.notificationService.success('Producto eliminado del carrito');
            return CartActions.removeFromCartSuccess({ cart });
          }),
          catchError(error => {
            this.notificationService.error('Error al eliminar producto del carrito');
            return of(CartActions.removeFromCartFailure({ error: error.message }));
          })
        )
      )
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      switchMap(() =>
        this.cartService.clearCart().pipe(
          map(() => {
            this.notificationService.success('Carrito vacío');
            return CartActions.clearCartSuccess();
          }),
          catchError(error => {
            this.notificationService.error('Error al vaciar el carrito');
            return of(CartActions.clearCartFailure({ error: error.message }));
          })
        )
      )
    )
  );

  loadCartSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCartSummary),
      switchMap(() =>
        this.cartService.getCartSummary().pipe(
          map(summary => CartActions.loadCartSummarySuccess({ summary })),
          catchError(error => of(CartActions.loadCartSummaryFailure({ error: error.message })))
        )
      )
    )
  );

  validateCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.validateCart),
      switchMap(() =>
        this.cartService.validateCart().pipe(
          map(cart => CartActions.validateCartSuccess({ cart })),
          catchError(error => of(CartActions.validateCartFailure({ error: error.message })))
        )
      )
    )
  );
}
