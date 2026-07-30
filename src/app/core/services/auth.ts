import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Auth';
  private readonly tokenKey = 'auth_token';

  login(data: LoginRequest): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/login`, data, {
        responseType: 'text',
      })
      .pipe(
        tap((token) => {
          localStorage.setItem(this.tokenKey, token);
        }),
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
