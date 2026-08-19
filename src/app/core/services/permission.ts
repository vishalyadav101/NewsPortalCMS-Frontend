import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Permission, PermissionRequest } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Permission';

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }

  getById(id: string): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/${id}`);
  }

  create(data: PermissionRequest): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, data);
  }

  update(data: Permission): Observable<any> {
    return this.http.put(this.apiUrl, {
      id: data.id,
      name: data.name,
      code: data.code,
      description: data.description,
      module: data.module,
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
