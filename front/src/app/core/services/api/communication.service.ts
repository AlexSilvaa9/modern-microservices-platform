import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';

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

  sendImmediate(draft: CommunicationDraft): Observable<CommunicationActivity> {
    const recipients = this.audienceSize(draft.audience);
    const activity: CommunicationActivity = {
      id: this.activityId++,
      title: draft.subject,
      detail: `Envío inmediato a ${recipients} usuarios`,
      channel: 'instant',
      status: 'sent',
      recipients,
      createdAt: nowIso()
    };

    this.isSubmitting.set(true);
    this.statusMessage.set('Preparando envío inmediato...');

    return of(activity).pipe(
      delay(700),
      tap((result) => {
        this.activities.update((current) => [result, ...current].slice(0, 8));
        this.statusMessage.set(`Envío inmediato completado: ${draft.subject}`);
      }),
      finalize(() => this.isSubmitting.set(false))
    );
  }

  launchCampaign(draft: CommunicationDraft): Observable<CommunicationCampaign> {
    const recipients = this.audienceSize(draft.audience);
    const campaign: CommunicationCampaign = {
      id: this.campaignId++,
      name: draft.subject,
      audience: draft.audience,
      recipients,
      cadence: 'once',
      status: 'active',
      progress: 12,
      nextRun: addDays(new Date(), 1)
    };

    const activity: CommunicationActivity = {
      id: this.activityId++,
      title: draft.subject,
      detail: `Campaña creada para ${recipients} usuarios`,
      channel: 'campaign',
      status: 'queued',
      recipients,
      createdAt: nowIso()
    };

    this.isSubmitting.set(true);
    this.statusMessage.set('Generando campaña mock...');

    return of(campaign).pipe(
      delay(900),
      tap(() => {
        this.campaigns.update((current) => [campaign, ...current].slice(0, 6));
        this.activities.update((current) => [activity, ...current].slice(0, 8));
        this.statusMessage.set(`Campaña creada: ${draft.subject}`);
      }),
      finalize(() => this.isSubmitting.set(false))
    );
  }

  scheduleDailyCampaign(draft: CommunicationDraft): Observable<ScheduledDispatch[]> {
    const recipients = this.audienceSize(draft.audience);
    const schedule = Array.from({ length: 7 }, (_, index) => ({
      id: this.dispatchId++,
      subject: `${draft.subject} · Día ${index + 1}`,
      audience: draft.audience,
      recipients,
      date: addDays(new Date(), index + 1),
      status: 'scheduled' as const
    }));

    const activity: CommunicationActivity = {
      id: this.activityId++,
      title: draft.subject,
      detail: 'Secuencia diaria preparada para 7 días',
      channel: 'daily',
      status: 'scheduled',
      recipients,
      createdAt: nowIso()
    };

    const campaign: CommunicationCampaign = {
      id: this.campaignId++,
      name: `${draft.subject} · Secuencia diaria`,
      audience: draft.audience,
      recipients,
      cadence: 'daily',
      status: 'queued',
      progress: 8,
      nextRun: schedule[0].date
    };

    this.isSubmitting.set(true);
    this.statusMessage.set('Programando una pieza por día...');

    return of(schedule).pipe(
      delay(1000),
      tap((result) => {
        this.scheduledDispatches.update((current) => [...result, ...current].slice(0, 10));
        this.activities.update((current) => [activity, ...current].slice(0, 8));
        this.campaigns.update((current) => [campaign, ...current].slice(0, 6));
        this.statusMessage.set(`Secuencia diaria preparada: ${draft.subject}`);
      }),
      finalize(() => this.isSubmitting.set(false))
    );
  }
}