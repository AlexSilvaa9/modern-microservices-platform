import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationService } from '../../core/services/global-state/translation.service';

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  private route = inject(ActivatedRoute);
  private translation = inject(TranslationService);

  ngOnInit() {
    const lang = this.route.snapshot.params['lang'];
    this.translation.setLanguage(lang);
  }
}
