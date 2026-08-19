import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { RoleService } from '../../../core/services/role';
import { Role } from '../../../core/models/role.model';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly cdr = inject(ChangeDetectorRef);

  roles: Role[] = [];
  filteredRoles: Role[] = [];

  searchTerm = '';

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.roleService.getAll().subscribe({
      next: (data) => {
        console.log('Role API Response:', data);

        this.roles = data;
        this.filteredRoles = [...data];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Role GET Error:', error);

        this.roles = [];
        this.filteredRoles = [];

        this.errorMessage = 'Unable to load roles.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  applySearch(): void {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      this.filteredRoles = [...this.roles];
      return;
    }

    this.filteredRoles = this.roles.filter((role) => role.name.toLowerCase().includes(search));
  }

  clearSearch(): void {
    this.searchTerm = '';

    this.filteredRoles = [...this.roles];
  }

  deleteRole(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this role?');

    if (!confirmed) {
      return;
    }

    this.roleService.delete(id).subscribe({
      next: () => {
        this.loadRoles();
      },

      error: (error) => {
        console.error('Role Delete Error:', error);

        alert('Unable to delete role.');
      },
    });
  }
}
