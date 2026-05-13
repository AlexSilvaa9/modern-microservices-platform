import { APP_INITIALIZER, ApplicationConfig, inject, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { routes } from './app.routes';
import { AuthService } from './core/services/api/auth.service';
import { AnalyticsService } from './core/services/api/analytics.service';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
function initializeApp(authService: AuthService) {
  return () => {
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return Promise.resolve();
    }

    // Attempt to load the user using the HTTPOnly cookies on startup
    return firstValueFrom(
      authService.getMe().pipe(
        catchError(() => of(null)), // Ignore errors on boot (e.g. not logged in)
      ),
    );
  };
}

/**
 * Inicializa Analytics service
 * Solo en browser - SSR safe
 */
function initializeAnalytics(analyticsService: AnalyticsService) {
  return () => {
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return Promise.resolve();
    }

    // AnalyticsService ya inicia su tracking automático en el constructor
    // Esta función es un placeholder para asegurar que se inicializa en el bootstrapping
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor, refreshTokenInterceptor, loadingInterceptor]), withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAnalytics,
      deps: [AnalyticsService],
      multi: true,
    },
    provideClientHydration(withEventReplay()),
    providePrimeNG(
      {
        theme: {
          preset: Aura
        }
      }
    )
  ],
};
