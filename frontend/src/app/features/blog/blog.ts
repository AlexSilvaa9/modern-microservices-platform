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

  readonly valueProps = [
    'BLOG.VALUE_PROP_1',
    'BLOG.VALUE_PROP_2',
    'BLOG.VALUE_PROP_3',
    'BLOG.VALUE_PROP_4'
  ];

  readonly highlights = [
    { titleKey: 'BLOG.HIGHLIGHT.IDEMPOTENCY.TITLE', descKey: 'BLOG.HIGHLIGHT.IDEMPOTENCY.DESC' },
    { titleKey: 'BLOG.HIGHLIGHT.AUDIT.TITLE', descKey: 'BLOG.HIGHLIGHT.AUDIT.DESC' },
    { titleKey: 'BLOG.HIGHLIGHT.ASYNC.TITLE', descKey: 'BLOG.HIGHLIGHT.ASYNC.DESC' }
  ];

  readonly backendCards = [
    { titleKey: 'BLOG.BACKEND.USER.TITLE', descKey: 'BLOG.BACKEND.USER.DESC', noteKey: 'BLOG.BACKEND.USER.NOTE' },
    { titleKey: 'BLOG.BACKEND.PRODUCT.TITLE', descKey: 'BLOG.BACKEND.PRODUCT.DESC', noteKey: 'BLOG.BACKEND.PRODUCT.NOTE' },
    { titleKey: 'BLOG.BACKEND.CART.TITLE', descKey: 'BLOG.BACKEND.CART.DESC', noteKey: 'BLOG.BACKEND.CART.NOTE' },
    { titleKey: 'BLOG.BACKEND.ORDER.TITLE', descKey: 'BLOG.BACKEND.ORDER.DESC', noteKey: 'BLOG.BACKEND.ORDER.NOTE' },
    { titleKey: 'BLOG.BACKEND.MAIL.TITLE', descKey: 'BLOG.BACKEND.MAIL.DESC', noteKey: 'BLOG.BACKEND.MAIL.NOTE' },
    { titleKey: 'BLOG.BACKEND.CORE.TITLE', descKey: 'BLOG.BACKEND.CORE.DESC', noteKey: 'BLOG.BACKEND.CORE.NOTE' }
  ];

  readonly frontendCards = [
    { titleKey: 'BLOG.FRONTEND.ROUTING.TITLE', descKey: 'BLOG.FRONTEND.ROUTING.DESC', noteKey: 'BLOG.FRONTEND.ROUTING.NOTE' },
    { titleKey: 'BLOG.FRONTEND.STATE.TITLE', descKey: 'BLOG.FRONTEND.STATE.DESC', noteKey: 'BLOG.FRONTEND.STATE.NOTE' },
    { titleKey: 'BLOG.FRONTEND.UI.TITLE', descKey: 'BLOG.FRONTEND.UI.DESC', noteKey: 'BLOG.FRONTEND.UI.NOTE' },
    { titleKey: 'BLOG.FRONTEND.I18N.TITLE', descKey: 'BLOG.FRONTEND.I18N.DESC', noteKey: 'BLOG.FRONTEND.I18N.NOTE' },
    { titleKey: 'BLOG.FRONTEND.AUTH.TITLE', descKey: 'BLOG.FRONTEND.AUTH.DESC', noteKey: 'BLOG.FRONTEND.AUTH.NOTE' },
    { titleKey: 'BLOG.FRONTEND.SCREENS.TITLE', descKey: 'BLOG.FRONTEND.SCREENS.DESC', noteKey: 'BLOG.FRONTEND.SCREENS.NOTE' }
  ];

  readonly flowCards = [
    { titleKey: 'BLOG.FLOWS.AUTH.TITLE', descKey: 'BLOG.FLOWS.AUTH.DESC' },
    { titleKey: 'BLOG.FLOWS.CATALOG.TITLE', descKey: 'BLOG.FLOWS.CATALOG.DESC' },
    { titleKey: 'BLOG.FLOWS.CHECKOUT.TITLE', descKey: 'BLOG.FLOWS.CHECKOUT.DESC' },
    { titleKey: 'BLOG.FLOWS.ADMIN.TITLE', descKey: 'BLOG.FLOWS.ADMIN.DESC' }
  ];

  readonly infraCards = [
    { titleKey: 'BLOG.INFRA.JENKINS.TITLE', descKey: 'BLOG.INFRA.JENKINS.DESC', noteKey: 'BLOG.INFRA.JENKINS.NOTE' },
    { titleKey: 'BLOG.INFRA.TERRAFORM.TITLE', descKey: 'BLOG.INFRA.TERRAFORM.DESC', noteKey: 'BLOG.INFRA.TERRAFORM.NOTE' }
  ];

  ngOnInit() {
    // Detect language from URL path (es/, en/, de/, fr/)
    const urlPath = this.location.path();
    const langMatch = urlPath.match(/^\/(es|en|de|fr)(\/|$)/);
    const lang = langMatch ? langMatch[1] : 'es';
    
    this.translation.setLanguage(lang);
  }
}