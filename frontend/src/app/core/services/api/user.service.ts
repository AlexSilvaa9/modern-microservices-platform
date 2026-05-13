import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApiResponse, Role, UserDTO } from '../../models/user.model';
import { Page } from '../../models/page.model';

/** Interfaz para respuestas paginadas */


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);

    private readonly GATEWAY_URL = 'http://localhost:8080/api';
    private readonly USERS_URL = `${this.GATEWAY_URL}/user/`;
 

     
    /**
     * Obtiene todos los usuarios con paginación
     * @param page Número de página (0-indexed)
     * @param size Cantidad de usuarios por página
     * @param sort Campo para ordenar (ej: 'id,desc' o 'name,asc')
     */
    getAllUsers(page: number = 0, size: number = 20, sort?: string): Observable<BaseApiResponse<Page<UserDTO>>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        
        if (sort) {
            params = params.set('sort', sort);
        }

        return this.http.get<BaseApiResponse<Page<UserDTO>>>(
            `${this.USERS_URL}`,
            { params }
        );
    }


    /** Habilita un usuario usando el endpoint real del backend. */
    enableUser(userId: string): Observable<BaseApiResponse<null>> {
        const url = `${this.USERS_URL}enable?uuid=${userId}`;
        return this.http.patch<BaseApiResponse<null>>(url, null);
    }

    /** Deshabilita un usuario usando el endpoint real del backend. */
    disableUser(userId: string): Observable<BaseApiResponse<null>> {
        const url = `${this.USERS_URL}disable?uuid=${userId}`;
        return this.http.patch<BaseApiResponse<null>>(url, null);
    }

    /** Actualiza los roles de un usuario usando el endpoint real del backend. */
    setRoles(userId: string, roles: Role[] = []): Observable<BaseApiResponse<null>> {
        const url = `${this.USERS_URL}setRoles?uuid=${userId}`;
        return this.http.patch<BaseApiResponse<null>>(url, roles);
    }
   
}
