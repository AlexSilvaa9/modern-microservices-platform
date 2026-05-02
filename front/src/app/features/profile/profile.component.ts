import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { UserStateService } from '../../core/services/global-state/user-state.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
    private fb = inject(FormBuilder);
    private userState = inject(UserStateService);
    private sub?: Subscription;

    // Formulario personal de solo-lectura temporalmente
    profileForm = this.fb.nonNullable.group({
        email: [{ value: '', disabled: true }],
        username: [{ value: '', disabled: true }],
        roles: [{ value: '', disabled: true }],
        imageUrl: [{ value: '', disabled: true }],
        provider: [{ value: '', disabled: true }]
    });

    // Formulario independiente y activo para cambiar clave
    passwordForm = this.fb.nonNullable.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
    });

    avatarUrl = '';
    isLoading = false;

    ngOnInit() {
        this.sub = this.userState.currentUser$.subscribe(user => {
            if (user) {
                this.profileForm.patchValue({
                    email: user.email || '',
                    username: user.username || '',
                    roles: user.roles?.join(', ') || '',
                    imageUrl: user.imageUrl || '',
                    provider: user.provider || 'LOCAL'
                });
                this.avatarUrl = user.imageUrl || '';
            }
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    onChangePassword() {
        if (this.passwordForm.valid) {
            this.isLoading = true;
            const data = this.passwordForm.getRawValue();

            // Simulamos la lógica subyacente para validación hasta crear endpoints reales
            setTimeout(() => {
                console.log('Intento de cambiar contraseña', data);
                this.isLoading = false;
                this.passwordForm.reset();
                // A futuro llamar a un Toast o Popup the Success.
            }, 1500);
        }
    }
}
