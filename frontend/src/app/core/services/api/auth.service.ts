import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { BaseApiResponse, DataBaseLoginRequest, DataBaseRegistrationRequest, UserDTO } from '../../models/user.model';
import { UserStateService } from '../global-state/user-state.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private userState = inject(UserStateService);

    private readonly GATEWAY_URL = environment.apiUrl;
    // Adjust this depending exactly on the target Gateway or Service URL
    private readonly AUTH_URL = `${this.GATEWAY_URL}user/auth`;
    private readonly USERS_URL = `${this.GATEWAY_URL}user`;
    private readonly CLIENT_ID = '531484178477-8dlo3be4j6t71d06maccfmanndnchthr.apps.googleusercontent.com';
    /**
     * Login: autentica al usuario (200 OK) y obtiene sus datos completos
     * Si es exitoso: GET me para obtener datos y setear userState
     * Retorna: void (solo setea el estado)
     */
    login(req: DataBaseLoginRequest) {
        return this.http.post<BaseApiResponse<UserDTO>>(`${this.AUTH_URL}/login`, req).pipe(
            // Si post es exitoso (200), obtener datos completos
            switchMap(() => this.getMe())
        );
    }

    register(req: DataBaseRegistrationRequest): Observable<BaseApiResponse<UserDTO>> {
        return this.http.post<BaseApiResponse<UserDTO>>(`${this.AUTH_URL}/register`, req);
    }

    getMe(): Observable<BaseApiResponse<UserDTO>> {
        return this.http.get<BaseApiResponse<UserDTO>>(`${this.USERS_URL}/me`).pipe(
            tap(res => {
                if (res.data) {
                    this.userState.setCurrentUser(res.data);
                }
            })
        );
    }

    logout(): void {
        this.http.post(`${this.AUTH_URL}/logout`, {}, { withCredentials: true })
            .subscribe({
                next: () => {
                    this.userState.clearState();
                    // redirigir
                    window.location.href = '/';
                },
                error: (err) => {
                    console.error('Error al hacer logout', err);
                    // Aún así limpiamos por seguridad
                    this.userState.clearState();
                    window.location.href = '/';
                }
            });
    }
    loginWithGoogle() {
        const clientId = `${this.CLIENT_ID}`;
        const redirectUri = `${this.AUTH_URL}/google/callback`;
        const scope = 'openid email profile';

        const googleAuthUrl =
            'https://accounts.google.com/o/oauth2/v2/auth' +
            '?client_id=' + clientId +
            '&redirect_uri=' + encodeURIComponent(redirectUri) +
            '&response_type=code' +
            '&scope=' + encodeURIComponent(scope) +
            '&access_type=offline' +
            '&prompt=consent';

        window.location.href = googleAuthUrl;
    }
}
