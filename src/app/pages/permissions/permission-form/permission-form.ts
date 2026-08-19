import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Permission, PermissionRequest } from '../../../core/models/permission.model';

import { PermissionService } from '../../../core/services/permission';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permission-form.html',
  styleUrl: './permission-form.css',
})
export class PermissionForm implements OnInit {
  private readonly permissionService = inject(PermissionService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // MODE
  // ==========================================

  isEditMode = false;

  permissionId = '';

  // ==========================================
  // FORM
  // ==========================================

  name = '';

  code = '';

  description = '';

  module = '';

  // ==========================================
  // STATES
  // ==========================================

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  successMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;

      this.permissionId = id;

      this.loadPermission(id);
    }
  }

  // ==========================================
  // LOAD FOR EDIT
  // ==========================================

  loadPermission(id: string): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.permissionService.getById(id).subscribe({
      next: (response) => {
        console.log('Permission Details:', response);

        this.name = response.name || '';

        this.code = response.code || '';

        this.description = response.description || '';

        this.module = response.module || '';

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Permission GET Error:', error);

        this.errorMessage = 'Unable to load permission.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SAVE
  // ==========================================

  savePermission(form: NgForm): void {
    this.errorMessage = '';

    this.successMessage = '';

    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });

      return;
    }

    const request: PermissionRequest = {
      name: this.name.trim(),
      code: this.code.trim(),
      description: this.description.trim(),
      module: this.module.trim(),
    };

    this.isSaving = true;

    // ========================================
    // CREATE
    // ========================================

    if (!this.isEditMode) {
      this.permissionService.create(request).subscribe({
        next: (response) => {
          console.log('Permission Created:', response);

          this.isSaving = false;

          this.successMessage = 'Permission created successfully.';

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/permissions']);
          }, 800);
        },

        error: (error) => {
          console.error('Permission Create Error:', error);

          this.errorMessage = error?.error?.message || 'Unable to create permission.';

          this.isSaving = false;

          this.cdr.detectChanges();
        },
      });

      return;
    }

    // ========================================
    // UPDATE
    // ========================================

    const permission: Permission = {
      id: this.permissionId,
      name: request.name,
      code: request.code,
      description: request.description,
      module: request.module,
      createdDate: '',
      updatedDate: null,
    };

    this.permissionService.update(permission).subscribe({
      next: () => {
        console.log('Permission Updated');

        this.isSaving = false;

        this.successMessage = 'Permission updated successfully.';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/permissions']);
        }, 800);
      },

      error: (error) => {
        console.error('Permission Update Error:', error);

        this.errorMessage = error?.error?.message || 'Unable to update permission.';

        this.isSaving = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {
    this.router.navigate(['/permissions']);
  }
}
