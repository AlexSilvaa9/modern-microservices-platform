/**
 * PageVisitsDTO - Visitas por página
 */
export interface PageVisitsDTO {
  path: string;
  visits: number;
}

/**
 * MonthlyVisitsDTO - Visitas por mes
 */
export interface MonthlyVisitsDTO {
  month: string;
  visits: number;
}

/**
 * AnalyticsSummaryDTO - Resumen principal del dashboard
 * Respuesta de GET /api/analytics/summary
 */
export interface AnalyticsSummaryDTO {
  totalVisits: number;
  visitsByPage: PageVisitsDTO[];
  visitsByMonth: MonthlyVisitsDTO[];
}
