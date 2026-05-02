import { Injectable, signal } from '@angular/core';

import deTranslations from '../../../../../public/resources/i18n/de.json';
import enTranslations from '../../../../../public/resources/i18n/en.json';
import esTranslations from '../../../../../public/resources/i18n/es.json';
import frTranslations from '../../../../../public/resources/i18n/fr.json';

export type SupportedLanguage = 'en' | 'es' | 'de' | 'fr';
const LANGUAGES: SupportedLanguage[] = ['en', 'es', 'de', 'fr'];

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    readonly currentLang = signal<SupportedLanguage>('es');
    private translations = signal<Record<string, string>>({});
    private readonly dictionaries: Record<SupportedLanguage, Record<string, string>> = {
        en: enTranslations,
        es: esTranslations,
        de: deTranslations,
        fr: frTranslations,
    };

    constructor() {
        this.loadTranslations('es');
    }

    setLanguage(lang: String) {

        if (LANGUAGES.includes(lang as SupportedLanguage) && this.currentLang() !== lang) {
            this.currentLang.set(lang as SupportedLanguage);
            this.loadTranslations(lang as SupportedLanguage);
        }
    }

    toggleLanguage() {
        const curr = this.currentLang();
        const currentIndex = LANGUAGES.indexOf(curr);
        const nextIndex = (currentIndex + 1) % LANGUAGES.length;
        this.setLanguage(LANGUAGES[nextIndex]);
    }

    private loadTranslations(lang: SupportedLanguage) {
        this.translations.set(this.dictionaries[lang]);
    }

    translate(key: string): string {
        const dictionary = this.translations();
        return dictionary[key] || key;
    }

}
