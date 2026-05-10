import { Injectable, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { EventDTO } from '../../models/event.model';
import { AnalyticsSummaryDTO } from '../../models/analytics-summary.model';
import { SKIP_LOADING } from '../../interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private eventQueue: EventDTO[] = [];
  private flushInterval: number | null = null;
  private readonly FLUSH_INTERVAL_MS = 50000;
  private readonly BATCH_SIZE = 100;

  private destroy$ = new Subject<void>();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeRouterTracking();
      this.startBatchFlushing();
    }
  }

  private initializeRouterTracking(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.track('PAGE_VIEW', { path: event.urlAfterRedirects });
      });
  }

  private startBatchFlushing(): void {
    this.flushInterval = window.setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.FLUSH_INTERVAL_MS) as unknown as number;
  }

  public track(eventType: string, metadata?: Record<string, any>): void {
    const event: EventDTO = {
      eventType,
      path: this.router.url,
      createdAt: new Date().toISOString(),
      metadataJson: metadata ? JSON.stringify(metadata) : undefined
    };

    this.eventQueue.push(event);

    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  public trackClick(actionName: string, metadata?: Record<string, any>): void {
    this.track('CLICK', { action: actionName, ...metadata });
  }

  public trackSearch(query: string, metadata?: Record<string, any>): void {
    this.track('SEARCH', { query, ...metadata });
  }

  private flush(): void {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    console.log('📤 Sending analytics batch:', eventsToSend);

    this.http.post<void>('http://localhost:8080/api/user/events/batch', eventsToSend
      , {
        context: new HttpContext().set(SKIP_LOADING, true)
      }
    )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          console.log('✅ Analytics batch sent successfully');
        },
        error: (err) => {
          console.error('❌ Error sending analytics batch:', err);
          this.eventQueue.unshift(...eventsToSend);
        }
      });
  }

  public getSummary() {
    return this.http.get<AnalyticsSummaryDTO>('http://localhost:8080/api/user/analytics/summary');
  }

  public forceFlush(): void {
    this.flush();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.eventQueue.length > 0) {
      this.flush();
    }

    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval as unknown as NodeJS.Timeout);
    }
  }
}
