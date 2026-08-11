import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AssignNewsTagRequest } from '../models/news-tag.model';

@Injectable({
  providedIn: 'root',
})
export class NewsTagService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/NewsTag';

  getByNews(newsId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${newsId}`);
  }

  assign(data: AssignNewsTagRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, data);
  }
}
