import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
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
export interface CurrentUser {
  userId: string | null;
  name: string;
  email: string;
  userName: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Auth';

  private readonly tokenKey = 'auth_token';

  // ==========================================
  // LOGIN
  // ==========================================

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

    return this.http.post(`${this.apiUrl}/register`, formData, {
      responseType: 'text',
    });
  }

  // =========================
  // TOKEN
  // =========================

  // ==========================================
  // GET TOKEN
  // ==========================================

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ==========================================
  // LOGIN STATUS
  // ==========================================

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  getCurrentUser(): CurrentUser | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = this.decodeToken(token);

      if (!payload) {
        return null;
      }

      // ======================================
      // CLAIM KEYS
      // ======================================

      const nameIdentifierClaim =
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

      const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

      // ======================================
      // USER ID
      // ======================================

      const userId =
        payload[nameIdentifierClaim] ??
        payload['nameid'] ??
        payload['sub'] ??
        payload['userId'] ??
        null;

      // ======================================
      // NAME
      // ======================================

      const name =
        payload[nameClaim] ??
        payload['name'] ??
        payload['unique_name'] ??
        payload['fullName'] ??
        payload['FullName'] ??
        payload['userName'] ??
        payload['UserName'] ??
        '';

      // ======================================
      // EMAIL
      // ======================================

      const email = payload['email'] ?? payload['Email'] ?? '';

      // ======================================
      // USERNAME
      // ======================================

      const userName =
        payload['unique_name'] ??
        payload['userName'] ??
        payload['UserName'] ??
        payload[nameClaim] ??
        payload['name'] ??
        '';

      const currentUser: CurrentUser = {
        userId: userId ? String(userId) : null,

        name: String(name),

        email: String(email),

        userName: String(userName),
      };

      console.log('Current User From JWT:', currentUser);

      console.log('JWT Role:', payload[roleClaim] ?? payload['role'] ?? '');

      return currentUser;
    } catch (error) {
      console.error('Unable to read current user from token:', error);

      return null;
    }
  }

  // ==========================================
  // DECODE JWT
  // ==========================================

  private decodeToken(token: string): Record<string, any> | null {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      const base64Url = parts[1];

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT decode error:', error);

      return null;
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
