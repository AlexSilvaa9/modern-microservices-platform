import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { UserDTO, Role } from '../../core/models/user.model';
import { UserService } from '../../core/services/api/user.service';
import { UserStateService } from '../../core/services/global-state/user-state.service';
import { TranslationService } from '../../core/services/global-state/translation.service';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    providers: [MessageService],
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, ToastModule, TranslatePipe],
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    private userService = inject(UserService);
    private router = inject(Router);
    private location = inject(Location);
    private userState = inject(UserStateService);
    private translationService = inject(TranslationService);
    private messageService = inject(MessageService);

    user: UserDTO | null = null;
    showActions = false;
    roleOptions: Role[] = Object.values(Role) as Role[];
    editingUsername = '';
    selectedRoles: Role[] = [];
    isProcessing = false;

    ngOnInit(): void {
        // Leer usuario desde navigation state y, si no existe, usar el usuario actual cargado en memoria
        const nav = this.router.getCurrentNavigation();
        this.user = nav?.extras.state?.['user'] || (window.history as any).state?.['user'] || this.userState.getCurrentUserValue();

        if (!this.user) {
            this.messageService.add({
                severity: 'error',
                summary: this.translationService.translate('GENERAL.ERROR'),
                detail: this.translationService.translate('USER_DETAIL.NO_USER_LOADED')
            });
            return;
        }

        // Check si current user es admin
        const current = this.userState.getCurrentUserValue();
        this.showActions = !!current?.roles?.includes((<any>'ADMIN'));
        this.syncFromUser();
    }

    private syncFromUser() {
        this.selectedRoles = this.user?.roles ? [...this.user.roles] : [];
        this.editingUsername = this.user?.username || '';
    }

    isRoleAssigned(role: Role): boolean {
        return this.selectedRoles.includes(role);
    }

    toggleRole(role: Role) {
        if (!this.showActions) {
            return;
        }

        if (this.isRoleAssigned(role)) {
            this.selectedRoles = this.selectedRoles.filter(selectedRole => selectedRole !== role);
            return;
        }

        this.selectedRoles = [...this.selectedRoles, role];
    }

    saveRoles() {
        if (!this.user) {
            this.messageService.add({
                severity: 'error',
                summary: this.translationService.translate('GENERAL.ERROR'),
                detail: this.translationService.translate('USER_DETAIL.NO_USER_LOADED')
            });
            return;
        }
        this.isProcessing = true;
        this.userService.updateUserRoles(this.user.id || '', this.selectedRoles).subscribe({
            next: () => {
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translationService.translate('USER_DETAIL.SUCCESS'),
                    detail: this.translationService.translate('USER_DETAIL.ROLES_UPDATED')
                });
                this.syncFromUser();
            },
            error: () => {
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: this.translationService.translate('GENERAL.ERROR'),
                    detail: this.translationService.translate('USER_DETAIL.ROLES_UPDATE_ERROR')
                });
            }
        });
    }

    saveUsername() {
        if (!this.user) {
            this.messageService.add({
                severity: 'error',
                summary: this.translationService.translate('GENERAL.ERROR'),
                detail: this.translationService.translate('USER_DETAIL.NO_USER_LOADED')
            });
            return;
        }
        const newName = this.editingUsername?.trim();
        if (!newName) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translationService.translate('USER_DETAIL.VALIDATION'),
                detail: this.translationService.translate('USER_DETAIL.USERNAME_REQUIRED')
            });
            return;
        }
        this.isProcessing = true;
        this.userService.updateUsername(this.user.id || '', newName).subscribe({
            next: () => {
                this.isProcessing = false;
                this.user!.username = newName;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translationService.translate('USER_DETAIL.SUCCESS'),
                    detail: this.translationService.translate('USER_DETAIL.USERNAME_UPDATED')
                });
            },
            error: () => {
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: this.translationService.translate('GENERAL.ERROR'),
                    detail: this.translationService.translate('USER_DETAIL.USERNAME_UPDATE_ERROR')
                });
            }
        });
    }

    deleteUser() {
        if (!this.user) {
            this.messageService.add({
                severity: 'error',
                summary: this.translationService.translate('GENERAL.ERROR'),
                detail: this.translationService.translate('USER_DETAIL.NO_USER_LOADED')
            });
            return;
        }
        if (!confirm(this.translationService.translate('USER_DETAIL.DELETE_CONFIRM'))) return;
        this.isProcessing = true;
        this.userService.deleteUser(this.user.id || '').subscribe({
            next: () => {
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translationService.translate('USER_DETAIL.SUCCESS'),
                    detail: this.translationService.translate('USER_DETAIL.USER_DELETED')
                });
                setTimeout(() => this.location.back(), 1500);
            },
            error: () => {
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: this.translationService.translate('GENERAL.ERROR'),
                    detail: this.translationService.translate('USER_DETAIL.DELETE_ERROR')
                });
            }
        });
    }

    back() {
        this.location.back();
    }
}
