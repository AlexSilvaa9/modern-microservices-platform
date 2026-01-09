import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications$ | async" 
        class="notification"
        [ngClass]="'notification-' + notification.type"
        [@slideIn]>
        <div class="notification-content">
          <i class="notification-icon" [ngClass]="getIconClass(notification.type)"></i>
          <div class="notification-text">
            <strong *ngIf="notification.title" class="notification-title">{{ notification.title }}</strong>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button class="notification-close" (click)="removeNotification(notification.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    }

    .notification {
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      padding: 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .notification-icon {
      font-size: 20px;
      margin-top: 2px;
    }

    .notification-text {
      flex: 1;
    }

    .notification-title {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .notification-message {
      margin: 0;
      font-size: 13px;
      line-height: 1.4;
      opacity: 0.9;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.6;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .notification-close:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .notification-success {
      background-color: #d4edda;
      border-left: 4px solid #28a745;
      color: #155724;
    }

    .notification-error {
      background-color: #f8d7da;
      border-left: 4px solid #dc3545;
      color: #721c24;
    }

    .notification-warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      color: #856404;
    }

    .notification-info {
      background-color: #cce7ff;
      border-left: 4px solid #007bff;
      color: #004085;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications$!: Observable<Notification[]>;
  private subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string) {
    this.notificationService.remove(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bi bi-check-circle-fill text-success';
      case 'error':
        return 'bi bi-x-circle-fill text-danger';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill text-warning';
      case 'info':
        return 'bi bi-info-circle-fill text-info';
      default:
        return 'bi bi-info-circle-fill';
    }
  }
}
