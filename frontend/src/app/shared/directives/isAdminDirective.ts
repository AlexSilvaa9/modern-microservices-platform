import {
    Directive,
    TemplateRef,
    ViewContainerRef,
    inject,
    OnDestroy
} from '@angular/core';
import { map, Subscription } from 'rxjs';
import { UserStateService } from '../../core/services/global-state/user-state.service';
import { Role } from '../../core/models/user.model';

@Directive({
    selector: '[appIsAdmin]',
    standalone: true,
})
export class IsAdminDirective implements OnDestroy {

    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private userState = inject(UserStateService);

    private sub: Subscription;

    constructor() {
        this.sub = this.userState.currentUser$
            .pipe(map(user => !!user?.roles?.includes(Role.ADMIN)))
            .subscribe(isAdmin => {
                this.viewContainer.clear();

                if (isAdmin) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}