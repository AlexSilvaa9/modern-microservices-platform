import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CartService } from '../../core/services/global-state/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private cartService = inject(CartService);

  readonly cartItems = this.cartService.items;
  readonly cartCount = this.cartService.itemCount;
  readonly cartTotal = this.cartService.total;

  readonly welcomeCards = computed(() => [
    {
      titleKey: 'HOME.CARD1_TITLE',
      descriptionKey: 'HOME.CARD1_DESC'
    },
    {
      titleKey: 'HOME.CARD2_TITLE',
      descriptionKey: 'HOME.CARD2_DESC'
    },
    {
      titleKey: 'HOME.CARD3_TITLE',
      descriptionKey: 'HOME.CARD3_DESC'
    }
  ]);
}
