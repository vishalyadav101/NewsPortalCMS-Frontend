import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Seo, SeoRequest } from '../models/seo.model';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Seo';

  // GET /api/Seo
  getAll(): Observable<Seo[]> {
    return this.http.get<Seo[]>(this.apiUrl);
  }

  // GET /api/Seo/{id}
  getById(id: number): Observable<Seo> {
    return this.http.get<Seo>(`${this.apiUrl}/${id}`);
  }

  // POST /api/Seo
  create(data: SeoRequest): Observable<Seo> {
    return this.http.post<Seo>(this.apiUrl, data);
  }

  // PUT /api/Seo
  update(data: SeoRequest): Observable<unknown> {
    return this.http.put(this.apiUrl, data);
  }

  // DELETE /api/Seo/{id}
  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // GET /api/Seo/page/{pageName}
  getByPage(pageName: string): Observable<Seo> {
    return this.http.get<Seo>(`${this.apiUrl}/page/${encodeURIComponent(pageName)}`);
  }
}
