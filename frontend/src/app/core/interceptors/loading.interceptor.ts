import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/global-state/loading.service';
import { HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const skip = req.context.get(SKIP_LOADING);

  if (!skip) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skip) {
        loadingService.hide();
      }
    })
  );
};
