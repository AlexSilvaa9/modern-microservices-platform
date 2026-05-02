import {
  Component,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/global-state/translation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  private route = inject(ActivatedRoute);
  private translation = inject(TranslationService);

  ngOnInit() {
    const lang = this.route.snapshot.params['lang'];
    this.translation.setLanguage(lang);
  }
}