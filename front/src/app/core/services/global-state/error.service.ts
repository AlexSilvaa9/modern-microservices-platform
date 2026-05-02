import { Injectable, signal } from '@angular/core';

export interface AppError {
    message?: string;
    errors?: any;
    data?: any;
    timestamp?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    readonly currentError = signal<AppError | null>(null);

    showError(error: AppError) {
        this.currentError.set(error);
    }

    clearError() {
        this.currentError.set(null);
    }
}
