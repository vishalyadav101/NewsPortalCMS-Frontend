import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  RolePermissionResponse,
  AssignRolePermissionRequest,
} from '../models/role-permission.model';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/RolePermission';

  // ==========================================
  // GET ASSIGNED PERMISSIONS BY ROLE
  // GET /api/RolePermission/{roleId}
  // ==========================================

  getByRoleId(roleId: number): Observable<RolePermissionResponse> {
    return this.http.get<RolePermissionResponse>(`${this.apiUrl}/${roleId}`);
  }

  // ==========================================
  // ASSIGN PERMISSIONS TO ROLE
  // POST /api/RolePermission/assign
  // ==========================================

  assignPermissions(data: AssignRolePermissionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, data);
  }
}
