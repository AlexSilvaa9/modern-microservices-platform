import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/global-state/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Mostramos el loader cuando la solicitud inicia
    loadingService.show();

    // Lo escondemos pase lo que pase cuando finalice
    return next(req).pipe(
        finalize(() => {
            loadingService.hide();
        })
    );
};
