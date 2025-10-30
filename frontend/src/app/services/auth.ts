import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  creation_date: string;
  points: number;
}

export interface JwtPayload {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  login(credentials: LoginRequest): Observable<LoginResponse> {

    console.log('🔐 [AuthService] Intentando login con credenciales:', {
      email: credentials.email,
      password: credentials.password
    });
    console.log('🌐 [AuthService] URL de destino:', `${this.apiUrl}/auth/login`);

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response: LoginResponse) => {
          console.log('✅ [AuthService] Respuesta recibida del backend:', response);

          if (response.access_token) {
            console.log('🔑 [AuthService] Login exitoso - Guardando token JWT');

            localStorage.setItem('jwt_token', response.access_token);

          } else {
            console.warn('❌ [AuthService] Login fallido o access_token no recibido');
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    console.log('👤 [AuthService] Registrando nuevo usuario:', {
      name: userData.name,
      email: userData.email,
      password: '***' // No loguear la contraseña real
    });
    console.log('🌐 [AuthService] URL de registro:', `${this.apiUrl}/users`);

    return this.http.post<User>(`${this.apiUrl}/users`, userData)
      .pipe(
        tap((user: User) => {
          console.log('✅ [AuthService] Usuario registrado exitosamente:', user);
          console.log('📝 [AuthService] Detalles del usuario creado:', {
            id: user.id,
            name: user.name,
            email: user.email,
            points: user.points,
            creation_date: user.creation_date
          });
        })
      );
  }

  logout(): void {
    console.log('🚪 [AuthService] Iniciando proceso de logout');
    localStorage.removeItem('jwt_token');
    console.log('🗑️ [AuthService] Token JWT eliminado de localStorage.');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token');
    // La comprobación es simple: solo verifica si el token existe.
    // Para más seguridad, podrías decodificar el token y verificar su fecha de expiración.
    return !!token;
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}
