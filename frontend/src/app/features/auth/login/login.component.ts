import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/api/auth.service';
import { ErrorService } from '../../../core/services/global-state/error.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { environment } from '../../../../environments/environment';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private errorService = inject(ErrorService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loginForm = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    isLoading = false;
    isLoginDatabaseEnabled = environment.enableDatabaseLogging;
    loginWithGoogle() {
        this.authService.loginWithGoogle();
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;

            this.authService.login(this.loginForm.getRawValue()).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/home';
                    this.router.navigateByUrl(returnUrl);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorService.showError({
                        message: err.error?.message || 'Error occurred during login',
                        errors: err.error?.errors,
                        timestamp: err.error?.timestamp
                    });
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
