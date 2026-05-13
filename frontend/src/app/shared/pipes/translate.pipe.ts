import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/global-state/translation.service';

@Pipe({
    name: 'translate',
    standalone: true,
    // pure: false 
    // Hacemos que sea impuro para que forceje la renderización
    // cada vez que Angular verifique cambios (lo cual refrescará 
    // los textos instantáneamente cuando currentLang cambie).
    pure: false
})
export class TranslatePipe implements PipeTransform {
    private translationService = inject(TranslationService);

    transform(key: string): string {
        if (!key) return '';
        return this.translationService.translate(key);
    }
}
