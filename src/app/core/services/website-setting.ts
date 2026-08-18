import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WebsiteSetting, WebsiteSettingRequest } from '../models/website-setting.model';

@Injectable({
  providedIn: 'root',
})
export class WebsiteSettingService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/WebsiteSetting';

  // ==========================================
  // GET SETTINGS
  // GET /api/WebsiteSetting
  // ==========================================

  getSettings(): Observable<WebsiteSetting> {
    return this.http.get<WebsiteSetting>(this.apiUrl);
  }

  // ==========================================
  // GET BY ID
  // GET /api/WebsiteSetting/{id}
  // ==========================================

  getById(id: number): Observable<WebsiteSetting> {
    return this.http.get<WebsiteSetting>(`${this.apiUrl}/${id}`);
  }

  // ==========================================
  // CREATE
  // POST /api/WebsiteSetting
  // ==========================================

  create(data: WebsiteSettingRequest): Observable<WebsiteSetting> {
    return this.http.post<WebsiteSetting>(this.apiUrl, data);
  }

  // ==========================================
  // UPDATE
  // PUT /api/WebsiteSetting/{id}
  // ==========================================

  update(id: number, data: WebsiteSettingRequest): Observable<WebsiteSetting> {
    return this.http.put<WebsiteSetting>(`${this.apiUrl}/${id}`, data);
  }

  // ==========================================
  // DELETE
  // DELETE /api/WebsiteSetting/{id}
  // ==========================================

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ==========================================
  // LOGO UPLOAD
  // POST /api/WebsiteSetting/{id}/logo
  // ==========================================

  uploadLogo(id: number, file: File): Observable<any> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/${id}/logo`, formData);
  }

  // ==========================================
  // FAVICON UPLOAD
  // POST /api/WebsiteSetting/{id}/favicon
  // ==========================================

  uploadFavicon(id: number, file: File): Observable<any> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/${id}/favicon`, formData);
  }
}
