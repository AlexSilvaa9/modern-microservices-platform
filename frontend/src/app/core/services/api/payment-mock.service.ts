import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentMockService {
  private readonly http = inject(HttpClient);
  private readonly GATEWAY_URL = 'http://localhost:8080/api';
  private readonly PAYMENT_URL = `${this.GATEWAY_URL}/order`;

  confirmMockPayment(orderUuid: string): Observable<BaseApiResponse<null>> {
    return this.http.post<BaseApiResponse<null>>(`${this.PAYMENT_URL}/webhook/mock`, { uuid: orderUuid });
  }
}