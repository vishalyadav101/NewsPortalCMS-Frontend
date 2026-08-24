import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Auth';
  private readonly tokenKey = 'auth_token';

  // =========================
  // LOGIN
  // =========================

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

  // =========================
  // REGISTER
  // =========================

  register(data: RegisterRequest): Observable<any> {
    const formData = new FormData();

    formData.append('FirstName', data.firstName);
    formData.append('LastName', data.lastName);
    formData.append('Email', data.email);
    formData.append('UserName', data.userName);
    formData.append('Password', data.password);
    formData.append('ConfirmPassword', data.confirmPassword);

    return this.http.post(
  `${this.apiUrl}/register`,
  formData,
  {
    responseType: 'text',
  }
);
  }

  // =========================
  // TOKEN
  // =========================

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