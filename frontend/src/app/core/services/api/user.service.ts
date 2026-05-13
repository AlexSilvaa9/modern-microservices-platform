import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

import { BaseApiResponse, DataBaseLoginRequest, DataBaseRegistrationRequest, Role, UserDTO } from '../../models/user.model';
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

    /** Obtener usuario por id (o fallback mock) */
    getUserById(userId: string): Observable<BaseApiResponse<UserDTO>> {
        const url = `${this.USERS_URL}${userId}`;
        return this.http.get<BaseApiResponse<UserDTO>>(url).pipe(
            catchError(err => {
                console.warn('getUserById: endpoint no disponible, usando mock', err);
                const mock: BaseApiResponse<UserDTO> = {
                    message: 'mocked',
                    data: { id: userId, email: 'unknown@example.com', username: `user-${userId}`, roles: [Role.USER] }
                };
                return of(mock).pipe(delay(300));
            })
        );
    }

    /** Actualiza roles de un usuario. Si el endpoint falla, devuelve un mock. */
    updateUserRoles(userId: string, roles: Role[] = []): Observable<BaseApiResponse<UserDTO>> {
        const url = `${this.USERS_URL}${userId}/roles`;
        return this.http.put<BaseApiResponse<UserDTO>>(url, { roles }).pipe(
            catchError(err => {
                console.warn('updateUserRoles: endpoint no disponible, usando mock', err);
                // Mock: devolver usuario con roles actualizados
                const mock: BaseApiResponse<UserDTO> = {
                    message: 'mocked',
                    data: { id: userId, email: 'unknown', username: 'unknown', roles: roles }
                };
                return of(mock).pipe(delay(300));
            })
        );
    }

    /** Actualiza username de un usuario. Fallback mock si falla. */
    updateUsername(userId: string, username: string): Observable<BaseApiResponse<UserDTO>> {
        const url = `${this.USERS_URL}${userId}/username`;
        return this.http.put<BaseApiResponse<UserDTO>>(url, { username }).pipe(
            catchError(err => {
                console.warn('updateUsername: endpoint no disponible, usando mock', err);
                const mock: BaseApiResponse<UserDTO> = {
                    message: 'mocked',
                    data: { id: userId, email: 'unknown', username: username, roles: [] }
                };
                return of(mock).pipe(delay(300));
            })
        );
    }

    /** Elimina un usuario. Fallback mock si falla. */
    deleteUser(userId: string): Observable<BaseApiResponse<null>> {
        const url = `${this.USERS_URL}${userId}`;
        return this.http.delete<BaseApiResponse<null>>(url).pipe(
            catchError(err => {
                console.warn('deleteUser: endpoint no disponible, usando mock', err);
                const mock: BaseApiResponse<null> = { message: 'mocked', data: null };
                return of(mock).pipe(delay(300));
            })
        );
    }
}
