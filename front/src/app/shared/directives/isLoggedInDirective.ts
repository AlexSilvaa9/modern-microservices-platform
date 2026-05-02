import {
    Directive,
    TemplateRef,
    ViewContainerRef,
    inject,
    OnDestroy
} from '@angular/core';
import { map, Subscription } from 'rxjs';
import { UserStateService } from '../../core/services/global-state/user-state.service';

@Directive({
    selector: '[appIsLoggedIn]'
})
export class IsLoggedInDirective implements OnDestroy {

    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private userState = inject(UserStateService);

    private sub: Subscription;

    constructor() {
        this.sub = this.userState.currentUser$
            .pipe(map(user => !!user))
            .subscribe(isLoggedIn => {
                this.viewContainer.clear();

                if (isLoggedIn) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}