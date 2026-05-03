import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TranslationService } from '../../core/services/global-state/translation.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  private location = inject(Location);
  private translation = inject(TranslationService);

  ngOnInit() {
    // Detect language from URL path (es/, en/, de/, fr/)
    const urlPath = this.location.path();
    const langMatch = urlPath.match(/^\/(es|en|de|fr)(\/|$)/);
    const lang = langMatch ? langMatch[1] : 'es';
    
    this.translation.setLanguage(lang);
  }
}