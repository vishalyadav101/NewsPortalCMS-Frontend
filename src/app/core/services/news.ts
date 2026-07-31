import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { News, NewsRequest } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/News';

  getAll(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  getById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  create(data: NewsRequest): Observable<News> {
    return this.http.post<News>(this.apiUrl, data);
  }

  update(id: number, data: NewsRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
