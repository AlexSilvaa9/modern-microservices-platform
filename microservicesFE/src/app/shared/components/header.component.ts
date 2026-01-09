import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCartItemCount } from '../../store/cart/cart.selectors';
import { AppState } from '../../store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand fw-bold" routerLink="/">
            <i class="bi bi-shop me-2"></i>
            MicroStore
          </a>
          
          <button 
            class="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                  <i class="bi bi-house me-1"></i>
                  Inicio
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/catalog" routerLinkActive="active">
                  <i class="bi bi-grid me-1"></i>
                  Catálogo
                </a>
              </li>
            </ul>
            
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link position-relative" routerLink="/cart">
                  <i class="bi bi-cart3 fs-5"></i>
                  <span 
                    *ngIf="(cartItemCount$ | async) as count; else noItems"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {{ count }}
                    <span class="visually-hidden">productos en carrito</span>
                  </span>
                  <ng-template #noItems>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                      0
                      <span class="visually-hidden">productos en carrito</span>
                    </span>
                  </ng-template>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
    }
    
    .navbar-brand {
      font-size: 1.5rem;
    }
    
    .nav-link {
      transition: color 0.3s ease;
    }
    
    .nav-link:hover {
      color: #fff !important;
    }
    
    .nav-link.active {
      color: #fff !important;
    }
    
    .badge {
      font-size: 0.6rem;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class HeaderComponent implements OnInit {
  cartItemCount$!: Observable<number>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.cartItemCount$ = this.store.select(selectCartItemCount);
  }
}
