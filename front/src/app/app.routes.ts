import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  /**
   * RUTAS DE IDIOMA: Estructura repetida para cada idioma (es, en, de, fr)
   * 
   * ¿Por qué se repiten?
   * - Cada idioma tiene su propia URL: /es, /en, /de, /fr
   * - Los componentes detectan el idioma de la URL y cambian la traducción
   * - El prerendering genera HTML estático para cada una
  
   * ¿Por qué el prerendering?
   * - Genera HTML estático en dist/ durante el build
   * - Al visitar /es o /es/blog, se sirve HTML pregenera­do 
   * - No necesita esperar a Angular para renderizar
   */

  // Ruta raíz (sin idioma): landing-page por defecto
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing-page/landing-page')
            .then(m => m.LandingPage)
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/blog')
            .then(m => m.Blog)
      },
    ]
  },

  // Rutas para español (/es, /es/blog)
  {
    path: 'es',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing-page/landing-page')
            .then(m => m.LandingPage)
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/blog')
            .then(m => m.Blog)
      },
    ]
  },

  // Rutas para inglés (/en, /en/blog)
  {
    path: 'en',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing-page/landing-page')
            .then(m => m.LandingPage)
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/blog')
            .then(m => m.Blog)
      },
    ]
  },

  




    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () => import('./features/home/home').then(m => m.Home)
    },
    {
        path: 'users',
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/user-management/user-management').then(m => m.UserManagement)
            }
        ]
    },
    {
        path: 'auth',
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
    },
    { path: '**', redirectTo: 'es' }
];
