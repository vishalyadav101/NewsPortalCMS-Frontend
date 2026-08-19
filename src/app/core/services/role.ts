import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Role, RoleRequest } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/Role';

  // GET /api/Role
  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  // GET /api/Role/{id}
  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  // POST /api/Role
  create(data: RoleRequest): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, data);
  }

  // PUT /api/Role
  update(data: Role): Observable<any> {
    return this.http.put(this.apiUrl, {
      id: data.id,
      name: data.name,
    });
  }

  // DELETE /api/Role/{id}
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
