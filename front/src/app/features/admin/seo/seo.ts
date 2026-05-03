import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

interface SEOPage {
  id: number;
  title: string;
  slug: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  status: 'published' | 'draft';
  views: number;
  lastUpdated: string;
}

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
export class Seo implements OnInit {
  // Datos mock de páginas SEO
  pages = signal<SEOPage[]>([
    {
      id: 1,
      title: 'Inicio - Microservicios Template',
      slug: 'inicio',
      metaDescription: 'Plantilla moderna de microservicios con Kafka, Kubernetes y Spring Boot.',
      keywords: 'microservicios, kafka, kubernetes, spring boot, cloud-native',
      ogImage: 'https://via.placeholder.com/1200x630?text=Inicio',
      status: 'published',
      views: 5432,
      lastUpdated: '2026-05-01'
    },
    {
      id: 2,
      title: 'Blog - Arquitectura de Microservicios',
      slug: 'blog',
      metaDescription: 'Artículos y tutoriales sobre arquitectura de microservicios escalables.',
      keywords: 'arquitectura, microservicios, escalabilidad, api gateway, event-driven',
      ogImage: 'https://via.placeholder.com/1200x630?text=Blog',
      status: 'published',
      views: 2845,
      lastUpdated: '2026-04-28'
    },
    {
      id: 3,
      title: 'Usuarios - Panel de Administración',
      slug: 'usuarios',
      metaDescription: 'Gestión de usuarios en el panel administrativo.',
      keywords: 'usuarios, administración, roles, permisos',
      ogImage: 'https://via.placeholder.com/1200x630?text=Usuarios',
      status: 'published',
      views: 1203,
      lastUpdated: '2026-05-02'
    },
    {
      id: 4,
      title: 'Perfil de Usuario',
      slug: 'perfil',
      metaDescription: 'Información y configuración del perfil de usuario.',
      keywords: 'perfil, usuario, configuración, seguridad',
      ogImage: 'https://via.placeholder.com/1200x630?text=Perfil',
      status: 'draft',
      views: 432,
      lastUpdated: '2026-04-25'
    },
    {
      id: 5,
      title: 'Autenticación - Login & Register',
      slug: 'autenticacion',
      metaDescription: 'Página de autenticación con soporte para Google OAuth.',
      keywords: 'autenticación, login, registro, oauth, seguridad',
      ogImage: 'https://via.placeholder.com/1200x630?text=Auth',
      status: 'published',
      views: 8756,
      lastUpdated: '2026-05-02'
    }
  ]);

  // Datos para gráficas
  viewsChartData = signal<any>(null);
  viewsChartOptions = signal<any>(null);
  
  statusChartData = signal<any>(null);
  statusChartOptions = signal<any>(null);
  
  trendChartData = signal<any>(null);
  trendChartOptions = signal<any>(null);

  editingId = signal<number | null>(null);
  editingPage = signal<SEOPage | null>(null);

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    // Gráfica de vistas por página (Barras)
    this.viewsChartData.set({
      labels: this.pages().map(p => p.title.substring(0, 15) + '...'),
      datasets: [
        {
          label: 'Vistas',
          data: this.pages().map(p => p.views),
          backgroundColor: [
            '#102c58',
            '#1e4a8f',
            '#3068b8',
            '#4a7dd5',
            '#6d99e0'
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

    // Gráfica de estado (Pastel)
    const publishedCount = this.pages().filter(p => p.status === 'published').length;
    const draftCount = this.pages().filter(p => p.status === 'draft').length;
    
    this.statusChartData.set({
      labels: ['Publicado', 'Borrador'],
      datasets: [
        {
          data: [publishedCount, draftCount],
          backgroundColor: [
            '#22c55e',
            '#fbbf24'
          ],
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    });

    this.statusChartOptions.set({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    });

    // Gráfica de tendencia (Línea)
    this.trendChartData.set({
      labels: ['Hace 6d', 'Hace 5d', 'Hace 4d', 'Hace 3d', 'Hace 2d', 'Ayer', 'Hoy'],
      datasets: [
        {
          label: 'Vistas totales',
          data: [14200, 15800, 16900, 18200, 19100, 19800, 20668],
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

  getTotalViews(): number {
    return this.pages().reduce((sum, p) => sum + p.views, 0);
  }

  getPublishedCount(): number {
    return this.pages().filter(p => p.status === 'published').length;
  }

  getDraftCount(): number {
    return this.pages().filter(p => p.status === 'draft').length;
  }
}
