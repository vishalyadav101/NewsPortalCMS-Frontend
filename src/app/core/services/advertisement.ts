 import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Advertisement,
  AdvertisementRequest,
} from '../models/advertisement.model';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7103/api/Advertisement';

  getAll(): Observable<Advertisement[]> {
    return this.http.get<Advertisement[]>(this.apiUrl);
  }

  getById(id: string): Observable<Advertisement> {
    return this.http.get<Advertisement>(
      `${this.apiUrl}/${id}`
    );
  }

  create(data: AdvertisementRequest): Observable<Advertisement> {
    const formData = this.buildFormData(data);

    return this.http.post<Advertisement>(
      this.apiUrl,
      formData
    );
  }

  update(
    id: string,
    data: AdvertisementRequest
  ): Observable<unknown> {
    const formData = this.buildFormData(data);

    return this.http.put(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  private buildFormData(
    data: AdvertisementRequest
  ): FormData {
    const formData = new FormData();

    formData.append('title', data.title);

    formData.append(
      'description',
      data.description || ''
    );

    // Banner
    if (data.bannerFile) {
      formData.append(
        'bannerFile',
        data.bannerFile
      );
    }

    formData.append(
      'redirectUrl',
      data.redirectUrl || ''
    );

    formData.append(
      'position',
      String(data.position)
    );

    formData.append(
      'startDate',
      data.startDate
    );

    formData.append(
      'endDate',
      data.endDate
    );

    formData.append(
      'isActive',
      String(data.isActive)
    );

    formData.append(
      'displayOrder',
      String(data.displayOrder)
    );

    return formData;
  }
}