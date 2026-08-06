import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Menu, MenuRequest } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Menu';

  getAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  getById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/${id}`);
  }

  create(data: MenuRequest): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, data);
  }

  update(id: number, data: MenuRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
