import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/global-state/user-state.service';
import { Role } from '../models/user.model';

export const adminGuard: CanActivateFn = (route, state) => {
    const userStateService = inject(UserStateService);
    const router = inject(Router);

    const roles = userStateService.getCurrentUserValue()?.roles;

    if (roles?.includes(Role.ADMIN)) {
        return true; // Use authenticated
    }

    // Not authenticated, redirect to login page
    router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
};
