import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UserDTO, Role } from '../../core/models/user.model';
import { UserService } from '../../core/services/api/user.service';
import { UserStateService } from '../../core/services/global-state/user-state.service';
import { LANGUAGES, SupportedLanguage, TranslationService } from '../../core/services/global-state/translation.service';
import { ErrorService } from '../../core/services/global-state/error.service';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DropdownComponent, DropdownOption } from "../../shared/components/dropdown/dropdown.component";
@Component({
    selector: 'app-user-detail',
    standalone: true,
    providers: [MessageService],
    imports: [CommonModule, InputTextModule, ToastModule, FormsModule, TranslatePipe, DropdownComponent],
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    private userService = inject(UserService);
    private router = inject(Router);
    private location = inject(Location);
    private userState = inject(UserStateService);
    private translationService = inject(TranslationService);
    private errorService = inject(ErrorService);
    private messageService = inject(MessageService);
    private translate = inject(TranslationService);
    user: UserDTO | null = null;
    showActions = false;
    roleOptions: Role[] = Object.values(Role) as Role[];
    selectedRoles: Role[] = [];
    isProcessing = false;
   languages: DropdownOption[] = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Français', value: 'fr' }
    ];
    selectedLanguage: SupportedLanguage = 'es';
    
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

        // Aplicar idioma preferido del usuario si existe
        if (this.user?.preferredLanguage) {
            this.selectedLanguage = this.user.preferredLanguage as SupportedLanguage;
            this.translationService.setLanguage(this.user.preferredLanguage as SupportedLanguage);
        } else {
            this.selectedLanguage = this.translationService.currentLang();
        }
    }

    private syncFromUser() {
        this.selectedRoles = this.user?.roles ? [...this.user.roles] : [];
    }

    get isUserEnabled(): boolean {
        return this.user?.enabled !== false;
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

        this.isProcessing = true;
        this.userService.setRoles(this.user?.id || '', this.selectedRoles).subscribe({
            next: () => {
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translationService.translate('USER_DETAIL.SUCCESS'),
                    detail: this.translationService.translate('USER_DETAIL.ROLES_UPDATED')
                });
            },
            error: (err) => {
                this.isProcessing = false;
                this.errorService.showError({
                    message: err.error?.message || this.translationService.translate('USER_DETAIL.ROLES_UPDATE_ERROR'),
                    errors: err.error?.errors,
                    timestamp: err.error?.timestamp
                });
            }
        });
    }

    enableUser() {

        this.isProcessing = true;
        this.userService.enableUser(this.user?.id || '').subscribe({
            next: () => {
                this.isProcessing = false;
                this.user!.enabled = true;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translationService.translate('USER_DETAIL.SUCCESS'),
                    detail: this.translationService.translate('USER_DETAIL.USER_ENABLED')
                });
            },
            error: (err) => {
                this.isProcessing = false;
                this.errorService.showError({
                    message: err.error?.message || this.translationService.translate('USER_DETAIL.USER_STATUS_UPDATE_ERROR'),
                    errors: err.error?.errors,
                    timestamp: err.error?.timestamp
                });
            }
        });
    }

    disableUser() {
       
        this.isProcessing = true;
        this.userService.disableUser(this.user?.id || '').subscribe({
            next: () => {
                this.isProcessing = false;
                this.user!.enabled = false;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translationService.translate('USER_DETAIL.SUCCESS'),
                    detail: this.translationService.translate('USER_DETAIL.USER_DISABLED')
                });
            },
            error: (err) => {
                this.isProcessing = false;
                this.errorService.showError({
                    message: err.error?.message || this.translationService.translate('USER_DETAIL.USER_STATUS_UPDATE_ERROR'),
                    errors: err.error?.errors,
                    timestamp: err.error?.timestamp
                });
            }
        });
    }
    setPreferredLanguage(lang: SupportedLanguage) {
       
        this.isProcessing = true;
        this.userService.setPreferredLanguage(this.user?.id || '', lang).subscribe({
            next: () => {
                this.isProcessing = false;
                this.user!.preferredLanguage = lang;
                this.selectedLanguage = lang;
                this.translationService.setLanguage(lang);
                this.messageService.add({
                    severity: 'success',
                    summary: this.translationService.translate('USER_DETAIL.SUCCESS'),
                    detail: this.translationService.translate('USER_DETAIL.USER_PREFERRED_LANGUAGE_UPDATED')
                });
                
            },
            error: (err) => {
                this.isProcessing = false;
                this.selectedLanguage = this.user?.preferredLanguage as SupportedLanguage || 'es';
                this.errorService.showError({
                    message: err.error?.message || this.translationService.translate('USER_DETAIL.USER_STATUS_UPDATE_ERROR'),
                    errors: err.error?.errors,
                    timestamp: err.error?.timestamp
                });
            }
        });
    }
   
    back() {
        this.location.back();
    }
}
