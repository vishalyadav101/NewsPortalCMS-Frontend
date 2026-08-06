import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MenuItem, MenuItemRequest } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/MenuItem';

  getByMenu(menuId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu/${menuId}`);
  }

  getById(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/${id}`);
  }

  create(data: MenuItemRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl, data);
  }

  update(id: number, data: MenuItemRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
