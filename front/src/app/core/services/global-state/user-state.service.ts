import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../../models/user.model';
import { CartService } from './cart.service';

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    private cartService = inject(CartService);

    private readonly _currentUser = new BehaviorSubject<UserDTO | null>(null);

    /** Observable for components to subscribe to user changes */
    public readonly currentUser$: Observable<UserDTO | null> = this._currentUser.asObservable();

    /** Set the current logged-in user */
    setCurrentUser(user: UserDTO | null): void {
        this._currentUser.next(user);
        if (user) {
            // Optionally, load user-specific data like cart here
            this.cartService.loadCart();
        }


    }

    /** Get snapshot of the current user */
    getCurrentUserValue(): UserDTO | null {
        return this._currentUser.getValue();
    }

    /** Clear user state (Logout) */
    clearState(): void {
        this._currentUser.next(null);
    }
}
