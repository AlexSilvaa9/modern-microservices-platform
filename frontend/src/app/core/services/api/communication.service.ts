import { Injectable, signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, finalize, tap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export type CommunicationAudience = 'all' | 'active-customers' | 'new-users' | 'inactive-users';
export type CommunicationChannel = 'instant' | 'campaign' | 'daily';

export interface CommunicationDraft {
  subject: string;
  message: string;
  audience: CommunicationAudience;
}

export interface CommunicationActivity {
  id: number;
  title: string;
  detail: string;
  channel: CommunicationChannel;
  status: 'sent' | 'queued' | 'scheduled';
  recipients: number;
  createdAt: string;
}

export interface CommunicationCampaign {
  id: number;
  name: string;
  audience: CommunicationAudience;
  recipients: number;
  cadence: 'once' | 'daily';
  status: 'active' | 'queued';
  progress: number;
  nextRun: string;
}

export interface ScheduledDispatch {
  id: number;
  subject: string;
  audience: CommunicationAudience;
  recipients: number;
  date: string;
  status: 'scheduled';
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private http = inject(HttpClient);
  private readonly GATEWAY_URL = 'http://localhost:8080/api';
  private readonly MAIL_URL = `${this.GATEWAY_URL}/mail`;
  private activityId = 4;
  private campaignId = 3;
  private dispatchId = 4;

  public isSubmitting = signal(false);
  public statusMessage = signal('Mock listo para operar');
  public activities = signal<CommunicationActivity[]>([
    {
      id: 3,
      title: 'Bienvenida a nuevos usuarios',
      detail: 'Envío inmediato completado para onboarding',
      channel: 'instant',
      status: 'sent',
      recipients: 1280,
      createdAt: addDays(new Date(), -1)
    },
    {
      id: 2,
      title: 'Campaña DevOps Pro',
      detail: 'Campaña programada para usuarios activos',
      channel: 'campaign',
      status: 'queued',
      recipients: 860,
      createdAt: addDays(new Date(), -2)
    },
    {
      id: 1,
      title: 'Digest diario',
      detail: 'Secuencia diaria de contenido técnico',
      channel: 'daily',
      status: 'scheduled',
      recipients: 540,
      createdAt: addDays(new Date(), -3)
    }
  ]);

  public campaigns = signal<CommunicationCampaign[]>([
    {
      id: 2,
      name: 'Lanzamiento Cloud Native',
      audience: 'active-customers',
      recipients: 860,
      cadence: 'once',
      status: 'active',
      progress: 58,
      nextRun: addDays(new Date(), 1)
    },
    {
      id: 1,
      name: 'Serie semanal de microservicios',
      audience: 'new-users',
      recipients: 540,
      cadence: 'daily',
      status: 'queued',
      progress: 22,
      nextRun: addDays(new Date(), 1)
    }
  ]);

  public scheduledDispatches = signal<ScheduledDispatch[]>([
    {
      id: 3,
      subject: 'Lección 1: Arquitectura base',
      audience: 'new-users',
      recipients: 540,
      date: addDays(new Date(), 1),
      status: 'scheduled'
    },
    {
      id: 2,
      subject: 'Lección 2: APIs REST',
      audience: 'new-users',
      recipients: 540,
      date: addDays(new Date(), 2),
      status: 'scheduled'
    },
    {
      id: 1,
      subject: 'Lección 3: Eventos y colas',
      audience: 'new-users',
      recipients: 540,
      date: addDays(new Date(), 3),
      status: 'scheduled'
    }
  ]);

  private audienceSize(audience: CommunicationAudience) {
    switch (audience) {
      case 'active-customers':
        return 860;
      case 'new-users':
        return 540;
      case 'inactive-users':
        return 310;
      default:
        return 1280;
    }
  }

  sendImmediate(draft: CommunicationDraft, recipientsList: string[]): Observable<unknown> {
    // Non-visual logic: only perform real API calls. Do NOT mutate visual mock state here.
    if (!recipientsList || recipientsList.length === 0) {
      this.statusMessage.set('Debe indicar al menos un destinatario');
      return of(null);
    }

    const payload = {
      recipients: recipientsList,
      subject: draft.subject,
      html: draft.message
    };

    this.isSubmitting.set(true);
    this.statusMessage.set('Enviando correo...');

    return this.http.post<string>(`${this.MAIL_URL}/batch`, payload).pipe(
      tap(() => this.statusMessage.set(`Envío completado: ${draft.subject}`)),
      catchError((err) => {
        console.error('Error sending batch email', err);
        this.statusMessage.set('Error enviando correo');
        return of(null);
      }),
      finalize(() => this.isSubmitting.set(false))
    );
  }

  launchCampaign(draft: CommunicationDraft): Observable<CommunicationCampaign> {
    // Campaigns currently not supported server-side. Keep UI mock data static; service does not create campaigns.
    this.statusMessage.set('Campañas no disponibles');
    return of(null as unknown as CommunicationCampaign);
  }

  scheduleDailyCampaign(draft: CommunicationDraft): Observable<ScheduledDispatch[]> {
    // Scheduling not available server-side. Service does not mutate visual mock lists.
    this.statusMessage.set('Programación no disponible');
    return of([] as ScheduledDispatch[]);
  }
}