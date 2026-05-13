import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiResponse } from '../../models/user.model';
import { OrderPage, OrderStatus } from '../../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);

    private readonly GATEWAY_URL = 'http://localhost:8080/api';
    private readonly ORDER_URL = `${this.GATEWAY_URL}/order`;
    

    checkout(): Observable<BaseApiResponse<string>> {
        return this.http.get<BaseApiResponse<string>>(`${this.ORDER_URL}/`);
    }

    orderHistory(page: number = 0, size: number = 20, sort?: string): Observable<BaseApiResponse<OrderPage>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (sort) {
            params = params.set('sort', sort);
        }

        return this.http.post<BaseApiResponse<OrderPage>>(
            `${this.ORDER_URL}/orderHistory`,
            {},
            { params }
        );
    }

    getByStatus(status: OrderStatus, page: number = 0, size: number = 20, sort?: string): Observable<BaseApiResponse<OrderPage>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('orderStatus', status);

        if (sort) {
            params = params.set('sort', sort);
        }

        return this.http.post<BaseApiResponse<OrderPage>>(
            `${this.ORDER_URL}/getByStatus`,
            {},
            { params }
        );
    }

    markAsCompleted(orderId: string): Observable<BaseApiResponse<null>> {
        let params = new HttpParams().set('orderUuid', orderId);
        return this.http.get<BaseApiResponse<null>>(`${this.ORDER_URL}/markAsCompleted`, { params });
    }

}

