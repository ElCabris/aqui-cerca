import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth';
import { JwtPayload } from './auth';

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
  private authService = inject(AuthService);

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/email/${email}`);
  }

  getCurrentUser(): Observable<User> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('No user logged in. Token not found.');
    }

    let userEmail: string;

    try {
      const payload: JwtPayload = jwtDecode(token);
      userEmail = payload.sub;

    } catch (error) {
      throw new Error('Invalid JWT token format.');
    }

    if (userEmail) {
      return this.getUserByEmail(userEmail);
    }

    throw new Error('JWT payload missing user email (sub).');
  }
}
