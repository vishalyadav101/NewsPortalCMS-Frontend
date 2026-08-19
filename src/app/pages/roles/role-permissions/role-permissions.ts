import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { RoleService } from '../../../core/services/role';
import { PermissionService } from '../../../core/services/permission';
import { RolePermissionService } from '../../../core/services/role-permission';

import { Role } from '../../../core/models/role.model';
import { Permission } from '../../../core/models/role-permission.model';

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-permissions.html',
  styleUrl: './role-permissions.css',
})
export class RolePermissions implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly roleService = inject(RoleService);
  private readonly permissionService = inject(PermissionService);
  private readonly rolePermissionService = inject(RolePermissionService);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // ROLE
  // ==========================================

  roleId = 0;

  role: Role | null = null;

  // ==========================================
  // PERMISSIONS
  // ==========================================

  permissions: Permission[] = [];

  selectedPermissionIds: string[] = [];

  // ==========================================
  // STATES
  // ==========================================

  isLoading = true;

  isSaving = false;

  errorMessage = '';

  successMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid role ID.';
      this.isLoading = false;
      return;
    }

    this.roleId = Number(id);

    if (isNaN(this.roleId) || this.roleId <= 0) {
      this.errorMessage = 'Invalid role ID.';
      this.isLoading = false;
      return;
    }

    this.loadRole();
  }

  // ==========================================
  // LOAD ROLE
  // ==========================================

  loadRole(): void {
    this.roleService.getById(this.roleId).subscribe({
      next: (response) => {
        console.log('Role Details:', response);

        this.role = response;

        this.loadPermissions();
      },

      error: (error) => {
        console.error('Role Details Error:', error);

        this.errorMessage = 'Unable to load role.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // LOAD ALL PERMISSIONS
  // ==========================================

  loadPermissions(): void {
    this.permissionService.getAll().subscribe({
      next: (response) => {
        console.log('All Permissions:', response);

        this.permissions = response;

        this.loadAssignedPermissions();
      },

      error: (error) => {
        console.error('Permission GET Error:', error);

        this.errorMessage = 'Unable to load permissions.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // LOAD ASSIGNED PERMISSIONS
  // ==========================================

  // ==========================================
  // LOAD ASSIGNED PERMISSIONS
  // ==========================================

  loadAssignedPermissions(): void {
    this.rolePermissionService.getByRoleId(this.roleId).subscribe({
      next: (response) => {
        console.log('Role Permission Response:', response);

        /*
         * Backend currently returns:
         *
         * {
         *   roleId: 1,
         *   roleName: "SuperAdmin",
         *   permissions: [
         *     "Create News"
         *   ]
         * }
         *
         * Important:
         * API runtime par permission names return kar rahi hai,
         * Permission objects nahi.
         */

        const assignedPermissions = response.permissions as unknown[];

        this.selectedPermissionIds = assignedPermissions
          .map((assignedPermission) => {
            // Backend string return kare to
            // permission name se matching karo.
            if (typeof assignedPermission === 'string') {
              const matchedPermission = this.permissions.find(
                (permission) =>
                  permission.name.trim().toLowerCase() === assignedPermission.trim().toLowerCase(),
              );

              return matchedPermission?.id ?? null;
            }

            // Agar future me backend complete Permission object
            // return kare to ye bhi support karega.
            if (
              assignedPermission &&
              typeof assignedPermission === 'object' &&
              'id' in assignedPermission
            ) {
              return String((assignedPermission as { id: string }).id);
            }

            return null;
          })
          .filter((id): id is string => id !== null);

        console.log('Selected Permission IDs:', this.selectedPermissionIds);

        /*
         * Agar role object available nahi hai
         * to response se role bana denge.
         */

        if (!this.role) {
          this.role = {
            id: response.roleId,
            name: response.roleName,
          };
        }

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Role Permission GET Error:', error);

        this.selectedPermissionIds = [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // CHECK PERMISSION
  // ==========================================

  isSelected(permissionId: string): boolean {
    return this.selectedPermissionIds.includes(permissionId);
  }

  // ==========================================
  // TOGGLE PERMISSION
  // ==========================================

  togglePermission(permissionId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      if (!this.selectedPermissionIds.includes(permissionId)) {
        this.selectedPermissionIds = [...this.selectedPermissionIds, permissionId];
      }

      return;
    }

    this.selectedPermissionIds = this.selectedPermissionIds.filter((id) => id !== permissionId);
  }

  // ==========================================
  // SELECT ALL
  // ==========================================

  selectAll(): void {
    this.selectedPermissionIds = this.permissions.map((permission) => permission.id);
  }

  // ==========================================
  // CLEAR ALL
  // ==========================================

  clearAll(): void {
    this.selectedPermissionIds = [];
  }

  // ==========================================
  // SAVE PERMISSIONS
  // ==========================================

  savePermissions(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.isSaving = true;

    const request = {
      roleId: this.roleId,
      permissionIds: this.selectedPermissionIds,
    };

    console.log('Assign Role Permission Request:', request);

    this.rolePermissionService.assignPermissions(request).subscribe({
      next: (response) => {
        console.log('Permissions Assigned:', response);

        this.isSaving = false;

        this.successMessage = 'Permissions updated successfully.';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '';

          this.cdr.detectChanges();
        }, 3000);
      },

      error: (error) => {
        console.error('Permission Assignment Error:', error);

        this.errorMessage = error?.error?.message || 'Unable to update permissions.';

        this.isSaving = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // BACK
  // ==========================================

  goBack(): void {
    this.router.navigate(['/roles']);
  }
}
