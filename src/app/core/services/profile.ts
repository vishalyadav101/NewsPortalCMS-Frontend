import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Profile, UpdateProfileRequest } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Profile';

  // GET /api/Profile
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.apiUrl);
  }

  // PUT /api/Profile
  updateProfile(data: UpdateProfileRequest): Observable<Profile> {
    return this.http.put<Profile>(this.apiUrl, data);
  }

  // POST /api/Profile/image
  uploadProfileImage(file: File): Observable<Profile> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<Profile>(`${this.apiUrl}/image`, formData);
  }
}
