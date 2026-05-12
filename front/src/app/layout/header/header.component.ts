import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/api/auth.service';
import { TranslationService } from '../../core/services/global-state/translation.service';
import { UserStateService } from '../../core/services/global-state/user-state.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { IsLoggedInDirective } from '../../shared/directives/isLoggedInDirective';
import { IsNotLoggedInDirective } from '../../shared/directives/isNotLoggedInDirective';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../core/services/global-state/sidebar.service';
import { CartService } from '../../core/services/global-state/cart.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
    selector: 'app-header',
    imports: [CommonModule,
        RouterModule,
        TranslatePipe,
        IsLoggedInDirective,
        IsNotLoggedInDirective,
        ButtonModule,
        OverlayBadgeModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    private authService = inject(AuthService);
    public translationService = inject(TranslationService);
    public cartService = inject(CartService);
    public userState = inject(UserStateService);
    private router = inject(Router);

    logout() {
        this.authService.logout();
    }

    sidebar = inject(SidebarService);

    // convertir signal del servicio a variable local usable en template
    toggleSidebar() {
        console.log('toggleSidebar');
        this.sidebar.toggle();
    }

    goToUserDetail() {
        const current = this.userState.getCurrentUserValue();
        this.router.navigate(['/userdetail'], { state: { user: current } });
    }
  
}
