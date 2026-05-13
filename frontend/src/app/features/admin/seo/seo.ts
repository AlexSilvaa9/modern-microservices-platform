import { Component, signal, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../../core/services/api/analytics.service';
import { TranslationService } from '../../../core/services/global-state/translation.service';
import { ErrorService } from '../../../core/services/global-state/error.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsSummaryDTO, MonthlyVisitsDTO, PageVisitsDTO } from '../../../core/models/analytics-summary.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-seo',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    ButtonModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './seo.html',
  styleUrl: './seo.scss',
})
export class Seo implements OnInit, OnDestroy {
  private analyticsService = inject(AnalyticsService);
  private translationService = inject(TranslationService);
  private errorService = inject(ErrorService);
  private destroy$ = new Subject<void>();

  // Datos de analytics
  pages = signal<PageVisitsDTO[]>([]);
  summary = signal<AnalyticsSummaryDTO | null>(null);
  isLoading = signal<boolean>(true);

  // Datos para gráficas
  viewsChartData = signal<any>(null);
  viewsChartOptions = signal<any>(null);
  
  monthlyChartData = signal<any>(null);
  monthlyChartOptions = signal<any>(null);
  
  trendChartData = signal<any>(null);
  trendChartOptions = signal<any>(null);

  ngOnInit() {
    this.loadAnalytics();
  }

  private loadAnalytics(): void {
    this.analyticsService.getSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary: AnalyticsSummaryDTO) => {
          this.summary.set(summary);
          
          const pageAnalytics = summary.visitsByPage.map((page: PageVisitsDTO, index: number) => ({
            ...page,
            id: index,
            lastUpdated: new Date().toISOString().split('T')[0]
          }));
          
          this.pages.set(pageAnalytics);
          this.initializeCharts();
          this.isLoading.set(false);
        },
        error: (err: any) => {
          this.errorService.showError({
            message: err.error?.message || 'Error loading analytics',
            errors: err.error?.errors,
            timestamp: err.error?.timestamp
          });
          this.isLoading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeCharts() {
    const summary = this.summary();
    if (!summary) return;

    const pages = this.pages();

    // Gráfica de vistas por página (Barras)
    this.viewsChartData.set({
      labels: pages.map((p: any) => p.path?.substring(0, 20) + (p.path?.length > 20 ? '...' : '')),
      datasets: [
        {
          label: this.translationService.translate('SEO.CHART_VISITS'),
          data: pages.map((p: any) => p.visits),
          backgroundColor: [
            '#102c58',
            '#1e4a8f',
            '#3068b8',
            '#4a7dd5',
            '#6d99e0',
            '#8ab4e8',
            '#a8c8f0'
          ],
          borderColor: '#102c58',
          borderWidth: 1
        }
      ]
    });

    this.viewsChartOptions.set({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#e0e0e0'
          }
        },
        x: {
          ticks: {
            color: '#666'
          },
          grid: {
            display: false
          }
        }
      }
    });

    // Gráfica de visitas por mes (Línea)
    const months = summary.visitsByMonth;
    this.monthlyChartData.set({
      labels: months.map((m: MonthlyVisitsDTO) => m.month),
      datasets: [
        {
          label: this.translationService.translate('SEO.CHART_MONTHLY_VISITS'),
            data: months.map((m: MonthlyVisitsDTO) => m.visits),
          borderColor: '#102c58',
          backgroundColor: 'rgba(16, 44, 88, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#102c58',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }
      ]
    });

    this.monthlyChartOptions.set({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#e0e0e0'
          }
        },
        x: {
          ticks: {
            color: '#666'
          },
          grid: {
            display: false
          }
        }
      }
    });



    this.trendChartOptions.set({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#e0e0e0'
          }
        },
        x: {
          ticks: {
            color: '#666'
          },
          grid: {
            display: false
          }
        }
      }
    });
  }


  /**
   * Obtiene el número de visitas de la página más visitada
   */
  getMostVisitedPage(): number {
    const pages = this.pages();
    if (pages.length === 0) return 0;
    return Math.max(...pages.map((p: any) => p.visits));
  }

  getTopPageVisitsLabel(): string {
    return `${this.getMostVisitedPage()} ${this.translationService.translate('SEO.VISITS_SUFFIX')}`;
  }
}
