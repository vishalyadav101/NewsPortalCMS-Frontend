import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Role, RoleRequest } from '../../../core/models/role.model';

import { RoleService } from '../../../core/services/role';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm implements OnInit {
  private readonly roleService = inject(RoleService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // MODE
  // ==========================================

  isEditMode = false;

  roleId: number | null = null;

  // ==========================================
  // FORM
  // ==========================================

  name = '';

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

      this.roleId = Number(id);

      this.loadRole(this.roleId);
    }
  }

  // ==========================================
  // LOAD ROLE
  // ==========================================

  loadRole(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.roleService.getById(id).subscribe({
      next: (response) => {
        console.log('Role Details:', response);

        this.name = response.name || '';

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Role GET Error:', error);

        this.errorMessage = 'Unable to load role.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SAVE ROLE
  // ==========================================

  saveRole(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });

      return;
    }

    const request: RoleRequest = {
      name: this.name.trim(),
    };

    this.isSaving = true;

    // ========================================
    // CREATE
    // ========================================

    if (!this.isEditMode) {
      this.roleService.create(request).subscribe({
        next: (response) => {
          console.log('Role Created:', response);

          this.isSaving = false;

          this.successMessage = 'Role created successfully.';

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/roles']);
          }, 800);
        },

        error: (error) => {
          console.error('Role Create Error:', error);

          this.errorMessage = error?.error?.message || 'Unable to create role.';

          this.isSaving = false;

          this.cdr.detectChanges();
        },
      });

      return;
    }

    // ========================================
    // UPDATE
    // ========================================

    if (this.roleId === null) {
      return;
    }

    const role: Role = {
      id: this.roleId,
      name: request.name,
    };

    this.roleService.update(role).subscribe({
      next: () => {
        console.log('Role Updated');

        this.isSaving = false;

        this.successMessage = 'Role updated successfully.';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/roles']);
        }, 800);
      },

      error: (error) => {
        console.error('Role Update Error:', error);

        this.errorMessage = error?.error?.message || 'Unable to update role.';

        this.isSaving = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {
    this.router.navigate(['/roles']);
  }
}
