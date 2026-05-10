/**
 * Event DTO - Evento de tracking a enviar al backend
 * Se envía a /api/events y /api/events/batch
 */
export interface EventDTO {
  eventType: string;
  path: string;
  createdAt: string;
  metadataJson?: string;
}

/**
 * Tipos de eventos soportados
 */
export enum EventType {
  PAGE_VIEW = 'PAGE_VIEW',
  CLICK = 'CLICK',
  SEARCH = 'SEARCH',
  FORM_SUBMIT = 'FORM_SUBMIT',
  ERROR = 'ERROR',
  CUSTOM = 'CUSTOM'
}
