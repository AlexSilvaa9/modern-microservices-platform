import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { routes } from './app.routes';
import { AuthService } from './core/services/api/auth.service';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
function initializeApp(authService: AuthService) {
  return () => {
    // Attempt to load the user using the HTTPOnly cookies on startup
    return firstValueFrom(
      authService.getMe().pipe(
        catchError(() => of(null)), // Ignore errors on boot (e.g. not logged in)
      ),
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor, loadingInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
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
