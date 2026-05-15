import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpClient
} from '@angular/common/http';

import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { BaseApiResponse } from '../models/user.model';
import { UserStateService } from '../services/global-state/user-state.service';
import { ErrorService } from '../services/global-state/error.service';
import { environment } from '../../../environments/environment';
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const userState = inject(UserStateService);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      const isRefreshCall = req.url.includes('/auth/refresh');

      if (
        userState.getCurrentUserValue() &&
        error.status === 403 &&
        !isRefreshing &&
        !isRefreshCall
      ) {

        isRefreshing = true;
        refreshTokenSubject.next(null);

        return http.post<BaseApiResponse<void>>(
          `${environment.apiUrl}user/auth/refresh`,
          {},
          { withCredentials: true }
        ).pipe(

          switchMap(() => {
            isRefreshing = false;

            // repetir request original
            return next(req);
          }),

          catchError((refreshError) => {
            isRefreshing = false;

            userState.setCurrentUser(null);

            errorService.showError({
              message: 'Tu sesión ha expirado. Vuelve a iniciar sesión.'
            });

            router.navigate(['/auth/login']);

            // no propagar error al componente
            return EMPTY;
          })
        );
      }

      return throwError(() => error);
    })
  );
};