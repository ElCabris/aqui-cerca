// user.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/email/${email}`);
  }

  getCurrentUser(): Observable<User> {
    // Esto depende de cómo manejes la sesión
    // Por ahora, asumimos que tenemos el email en localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      return this.getUserByEmail(userEmail);
    }
    throw new Error('No user logged in');
  }
}
