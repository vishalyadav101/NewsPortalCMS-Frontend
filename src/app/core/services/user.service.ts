import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UpdateUserRequest, UpdateUserStatusRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/User';

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  update(id: number, data: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  updateStatus(id: number, data: UpdateUserStatusRequest): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
