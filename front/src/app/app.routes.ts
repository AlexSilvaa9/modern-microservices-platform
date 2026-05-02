import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
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

            // resto dinámico igual que ya tienes
        ]
    },

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

            // resto dinámico igual que ya tienes
        ]
    },

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

            // resto dinámico igual que ya tienes
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
