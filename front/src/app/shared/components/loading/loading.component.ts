import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/global-state/loading.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss'
})
export class LoadingComponent {
    public loadingService = inject(LoadingService);
}
