import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StaticPage, StaticPageRequest } from '../models/staticpage.model';

@Injectable({
  providedIn: 'root',
})
export class StaticPageService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/StaticPages';

  getAll(): Observable<StaticPage[]> {
    return this.http.get<StaticPage[]>(this.apiUrl);
  }

  getById(id: number): Observable<StaticPage> {
    return this.http.get<StaticPage>(`${this.apiUrl}/${id}`);
  }

  create(data: StaticPageRequest): Observable<StaticPage> {
    return this.http.post<StaticPage>(this.apiUrl, data);
  }

  update(id: number, data: StaticPageRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
