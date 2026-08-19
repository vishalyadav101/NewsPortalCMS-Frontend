import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PermissionService } from '../../../core/services/permission';
import { Permission } from '../../../core/models/permission.model';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './permission-list.html',
  styleUrl: './permission-list.css',
})
export class PermissionList implements OnInit {
  private readonly permissionService = inject(PermissionService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // DATA
  // ==========================================

  permissions: Permission[] = [];
  filteredPermissions: Permission[] = [];

  // ==========================================
  // SEARCH
  // ==========================================

  searchTerm = '';
  moduleFilter = '';

  // ==========================================
  // STATES
  // ==========================================

  isLoading = true;
  errorMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadPermissions();
  }

  // ==========================================
  // LOAD
  // ==========================================

  loadPermissions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.permissionService.getAll().subscribe({
      next: (data) => {
        console.log('Permission API Response:', data);

        this.permissions = data;

        this.filteredPermissions = [...data];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Permission GET Error:', error);

        this.permissions = [];
        this.filteredPermissions = [];

        this.errorMessage = 'Unable to load permissions.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // FILTER
  // ==========================================

  applyFilters(): void {
    const search = this.searchTerm.trim().toLowerCase();

    const module = this.moduleFilter.trim().toLowerCase();

    this.filteredPermissions = this.permissions.filter((permission) => {
      const matchesSearch =
        !search ||
        permission.name.toLowerCase().includes(search) ||
        permission.code.toLowerCase().includes(search) ||
        permission.description.toLowerCase().includes(search);

      const matchesModule = !module || permission.module.toLowerCase().includes(module);

      return matchesSearch && matchesModule;
    });
  }

  // ==========================================
  // CLEAR
  // ==========================================

  clearFilters(): void {
    this.searchTerm = '';
    this.moduleFilter = '';

    this.filteredPermissions = [...this.permissions];
  }

  // ==========================================
  // DELETE
  // ==========================================

  deletePermission(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this permission?');

    if (!confirmed) {
      return;
    }

    this.permissionService.delete(id).subscribe({
      next: () => {
        this.loadPermissions();
      },

      error: (error) => {
        console.error('Permission Delete Error:', error);

        alert('Unable to delete permission.');
      },
    });
  }
}
