import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Media, MediaRequest } from '../models/media.model';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Media';

  getAll(): Observable<Media[]> {
    return this.http.get<Media[]>(this.apiUrl);
  }

  getById(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.apiUrl}/${id}`);
  }

  create(data: MediaRequest): Observable<Media> {
    return this.http.post<Media>(this.apiUrl, data);
  }

  update(id: number, data: MediaRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
