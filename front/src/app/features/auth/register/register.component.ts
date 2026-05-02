import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/api/auth.service';
import { ErrorService } from '../../../core/services/global-state/error.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private errorService = inject(ErrorService);

    registerForm = this.fb.nonNullable.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]] // Assuming min length 4
    });

    isLoading = false;

    loginWithGoogle() {
        this.authService.loginWithGoogle();
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;

            this.authService.register(this.registerForm.getRawValue()).subscribe({
                next: () => {
                    this.isLoading = false;
                    // Successful registration, route them to login
                    this.router.navigate(['/auth/login']);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorService.showError({
                        message: err.error?.message || 'Error occurred during registration',
                        errors: err.error?.errors,
                        timestamp: err.error?.timestamp
                    });
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
