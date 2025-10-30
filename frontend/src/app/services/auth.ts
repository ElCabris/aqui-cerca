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
    return this.isTokenValid();
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payloadPart = token.split('.')[1];
      const decodedJson = this.base64UrlDecode(payloadPart);
      const decoded = JSON.parse(decodedJson) as JwtPayload;
      if (!decoded.exp) return false;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const valid = decoded.exp > nowInSeconds;
      if (!valid) {
        // Token expirado: limpiar y considerar no autenticado
        localStorage.removeItem('jwt_token');
      }
      return valid;
    } catch (e) {
      // Token malformado
      localStorage.removeItem('jwt_token');
      return false;
    }
  }

  private base64UrlDecode(input: string): string {
    // Normaliza Base64URL a Base64 estándar y decodifica
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad === 2) base64 += '==';
    else if (pad === 3) base64 += '=';
    else if (pad !== 0) throw new Error('Invalid base64url string');
    return atob(base64);
  }

  public getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadPart = token.split('.')[1];
      const decodedJson = this.base64UrlDecode(payloadPart);
      const decoded = JSON.parse(decodedJson) as JwtPayload;
      // En backend establecemos username y sub al email
      return decoded.sub || decoded.username || null;
    } catch {
      return null;
    }
  }
}
