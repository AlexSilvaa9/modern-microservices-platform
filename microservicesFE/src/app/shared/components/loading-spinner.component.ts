import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.show]="isLoading">
      <div class="spinner-container">
        <div class="spinner" [style.width.px]="size" [style.height.px]="size">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
        <p *ngIf="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .loading-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    .spinner-container {
      text-align: center;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .spinner {
      margin: 0 auto;
      text-align: center;
      position: relative;
    }

    .spinner > div {
      width: 18px;
      height: 18px;
      background-color: #007bff;
      border-radius: 100%;
      display: inline-block;
      animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }

    .spinner .bounce1 {
      animation-delay: -0.32s;
    }

    .spinner .bounce2 {
      animation-delay: -0.16s;
    }

    @keyframes sk-bouncedelay {
      0%, 80%, 100% {
        transform: scale(0);
      } 40% {
        transform: scale(1.0);
      }
    }

    .loading-message {
      margin-top: 1rem;
      color: #666;
      font-size: 14px;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
  @Input() message = '';
  @Input() size = 60;
}
