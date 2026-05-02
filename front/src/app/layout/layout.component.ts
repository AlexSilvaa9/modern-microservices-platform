import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorComponent } from '../shared/components/error/error.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { UserStateService } from '../core/services/global-state/user-state.service';
import { map } from 'rxjs/operators';
import { SidebarComponent } from './sidebar/sidebar';
import { SidebarService } from '../core/services/global-state/sidebar.service';

@Component({
    selector: 'app-layout',
    imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent, ErrorComponent, LoadingComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})
export class LayoutComponent {
    sidebarService = inject(SidebarService);
    private userState = inject(UserStateService);
    isLoggedIn$ = this.userState.currentUser$.pipe(map(user => !!user));
}
