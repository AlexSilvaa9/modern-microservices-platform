import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'app-footer',
    imports: [TranslatePipe],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
}
