import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseApiResponse } from '../models/user.model';
import { UserStateService } from '../services/global-state/user-state.service';
import { ErrorService } from '../services/global-state/error.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const userState = inject(UserStateService);
  const errorService = inject(ErrorService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si es un 403 (Forbidden - token expirado) y no estamos ya refrescando
      if (userState.getCurrentUserValue() && error.status === 403 && !isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        // Intentar refrescar el token
        return http.post<BaseApiResponse<void>>(
          'http://localhost:8080/api/user/auth/refresh',
          {},
          { withCredentials: true }
        ).pipe(
          switchMap(() => {
            isRefreshing = false;
            refreshTokenSubject.next(null);
            // Si el refresh fue exitoso, reintentar la petición original
            return next(req);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            // Si falla el refresh, redirigir a login
            router.navigate(['/auth/login']);
            userState.setCurrentUser(null);
            console.log("Session expired, redirecting to login.");
           
            return throwError(() => refreshError);
          })
        );
      }

      // Para otros errores, pasar directamente
      return throwError(() => error);
    })
  );
};
