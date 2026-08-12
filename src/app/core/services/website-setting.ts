import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { WebsiteSetting, WebsiteSettingRequest } from '../models/website-setting.model';

interface LogoUploadResponse {
  message: string;
  logoUrl: string;
}

interface FaviconUploadResponse {
  message: string;
  faviconUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebsiteSettingService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/WebsiteSetting';

  // =========================
  // GET
  // =========================

  get(): Observable<WebsiteSetting> {
    return this.http.get<WebsiteSetting>(this.apiUrl);
  }

  // =========================
  // GET BY ID
  // =========================

  getById(id: number): Observable<WebsiteSetting> {
    return this.http.get<WebsiteSetting>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CREATE
  // =========================

  create(data: WebsiteSettingRequest): Observable<WebsiteSetting> {
    return this.http.post<WebsiteSetting>(this.apiUrl, data);
  }

  // =========================
  // UPDATE
  // =========================

  update(id: number, data: WebsiteSettingRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // =========================
  // DELETE
  // =========================

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // =========================
  // UPLOAD LOGO
  // =========================

  uploadLogo(id: number, file: File): Observable<LogoUploadResponse> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<LogoUploadResponse>(`${this.apiUrl}/${id}/logo`, formData);
  }

  // =========================
  // UPLOAD FAVICON
  // =========================

  uploadFavicon(id: number, file: File): Observable<FaviconUploadResponse> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<FaviconUploadResponse>(`${this.apiUrl}/${id}/favicon`, formData);
  }
}
