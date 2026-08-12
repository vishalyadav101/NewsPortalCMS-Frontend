import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Notification,
  NotificationRequest,
  UpdateNotificationRequest,
} from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Notification';

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  create(data: NotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, data);
  }

  update(id: number, data: UpdateNotificationRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
