import { Component, inject } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ErrorService } from '../../../core/services/global-state/error.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [CommonModule, KeyValuePipe, TranslatePipe],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent {
    public errorService = inject(ErrorService);

    isObject(value: any): boolean {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
}
