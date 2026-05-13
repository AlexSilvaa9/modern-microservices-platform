import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/global-state/user-state.service';

export const authGuard: CanActivateFn = (route, state) => {
    const userStateService = inject(UserStateService);
    const router = inject(Router);

    const currentUser = userStateService.getCurrentUserValue();

    if (currentUser) {
        return true; // Use authenticated
    }

    // Not authenticated, redirect to login page
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
