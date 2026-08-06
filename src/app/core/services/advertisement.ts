import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Advertisement, AdvertisementRequest } from '../models/advertisement.model';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Advertisement';

  getAll(): Observable<Advertisement[]> {
    return this.http.get<Advertisement[]>(this.apiUrl);
  }

  getById(id: string): Observable<Advertisement> {
    return this.http.get<Advertisement>(`${this.apiUrl}/${id}`);
  }

  create(data: AdvertisementRequest): Observable<Advertisement> {
    return this.http.post<Advertisement>(this.apiUrl, data);
  }

  update(id: string, data: AdvertisementRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
