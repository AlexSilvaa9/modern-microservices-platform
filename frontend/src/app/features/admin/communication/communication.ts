import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommunicationAudience, CommunicationService } from '../../../core/services/api/communication.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-communication',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './communication.html',
  styleUrl: './communication.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Communication {
  private readonly communicationService = inject(CommunicationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly isSubmitting = this.communicationService.isSubmitting;
  readonly statusMessage = this.communicationService.statusMessage;
  readonly activities = this.communicationService.activities;
  readonly campaigns = this.communicationService.campaigns;
  readonly scheduledDispatches = this.communicationService.scheduledDispatches;

  readonly form = this.formBuilder.nonNullable.group({
    subject: ['', [Validators.required, Validators.minLength(4)]],
    audience: ['all' as CommunicationAudience, [Validators.required]],
    recipients: [''],
    message: ['', [Validators.required, Validators.minLength(20)]]
  });

  readonly hasRecipients = computed(() => {
    const raw = this.form.get('recipients')?.value ?? '';
    return raw.toString().trim().length > 0;
  });

  readonly todaySent = computed(() => {
    const today = new Date();
    return this.activities().filter((activity) => this.isSameDay(activity.createdAt, today)).length;
  });

  readonly activeCampaigns = computed(() => this.campaigns().filter((campaign) => campaign.status === 'active').length);
  readonly scheduledCount = computed(() => this.scheduledDispatches().length);
  readonly nextDispatch = computed(() => this.scheduledDispatches()[0]?.date ?? null);

  readonly audienceOptions: Array<{ label: string; value: CommunicationAudience }> = [
    { label: 'Todos', value: 'all' },
    { label: 'Clientes activos', value: 'active-customers' },
    { label: 'Usuarios nuevos', value: 'new-users' },
    { label: 'Usuarios inactivos', value: 'inactive-users' }
  ];

  sendNow() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const draft = this.form.getRawValue();
    const rawRecipients = (draft.recipients ?? '').toString();
    const recipientsList = rawRecipients
      .split(/[;,\n]/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    if (recipientsList.length === 0) {
      this.form.get('recipients')?.setErrors({ required: true });
      this.statusMessage.set('Introduce al menos un destinatario (email)');
      return;
    }

    this.communicationService.sendImmediate(draft, recipientsList).subscribe();
  }

  launchCampaign() {
    // Campaigns currently not supported; display status
    this.statusMessage.set('Campañas no soportadas en esta versión');
  }

  scheduleDaily() {
    // Scheduling currently not supported; display status
    this.statusMessage.set('Programación diaria no soportada en esta versión');
  }

  trackByActivity(index: number, item: { id: number }) {
    return item.id;
  }

  trackByCampaign(index: number, item: { id: number }) {
    return item.id;
  }

  trackByDispatch(index: number, item: { id: number }) {
    return item.id;
  }

  private isSameDay(dateValue: string, referenceDate: Date) {
    const candidate = new Date(dateValue);
    return (
      candidate.getFullYear() === referenceDate.getFullYear() &&
      candidate.getMonth() === referenceDate.getMonth() &&
      candidate.getDate() === referenceDate.getDate()
    );
  }
}