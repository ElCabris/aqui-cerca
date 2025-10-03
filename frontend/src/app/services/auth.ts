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
  message: string;
  success: boolean;
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

          if (response.success) {
            console.log('🔑 [AuthService] Login exitoso - Guardando en localStorage');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', credentials.email);
            console.log('💾 [AuthService] Datos guardados en localStorage:', {
              isLoggedIn: localStorage.getItem('isLoggedIn'),
              userEmail: localStorage.getItem('userEmail')
            });
          } else {
            console.warn('❌ [AuthService] Login fallido - El backend respondió con success: false');
            console.log('📋 [AuthService] Mensaje del backend:', response.message);
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
    console.log('🗑️ [AuthService] Limpiando localStorage...');

    const previousEmail = localStorage.getItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');

    console.log('✅ [AuthService] localStorage limpiado. Email anterior:', previousEmail);
    console.log('📍 [AuthService] Redirigiendo a /login');

    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');

    console.log('🔍 [AuthService] Verificando estado de login:', {
      isLoggedIn: isLoggedIn,
      userEmail: userEmail,
      timestamp: new Date().toISOString()
    });

    return isLoggedIn;
  }

  // Método adicional para debugging del estado actual
  getAuthState(): void {
    console.log('🔍 [AuthService] Estado actual de autenticación:', {
      isLoggedIn: localStorage.getItem('isLoggedIn'),
      userEmail: localStorage.getItem('userEmail'),
      allLocalStorage: { ...localStorage }
    });
  }

  // Método para verificar conexión con el backend
  testBackendConnection(): Observable<any> {
    console.log('🧪 [AuthService] Probando conexión con el backend...');
    console.log('🌐 [AuthService] URL de prueba:', `${this.apiUrl}/users`);

    return this.http.get(`${this.apiUrl}/users`).pipe(
      tap({
        next: (response) => {
          console.log('✅ [AuthService] Conexión con backend exitosa:', response);
        },
        error: (error) => {
          console.error('💥 [AuthService] Error de conexión con backend:', error);
          console.log('📊 [AuthService] Detalles del error:', {
            status: error.status,
            message: error.message,
            url: error.url
          });
        }
      })
    );
  }
}
