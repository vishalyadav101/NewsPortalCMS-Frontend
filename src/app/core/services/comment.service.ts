import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Comment, CommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Comment';

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

  getById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }

  getByNewsId(newsId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/news/${newsId}`);
  }

  create(data: CommentRequest): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
