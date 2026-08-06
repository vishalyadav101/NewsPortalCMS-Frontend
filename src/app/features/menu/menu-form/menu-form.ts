import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MenuService } from '../../../core/services/menu';
import { MenuRequest } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-form.html',
  styleUrl: './menu-form.css',
})
export class MenuForm implements OnInit {
  private readonly menuService = inject(MenuService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  menu: MenuRequest = {
    name: '',
    location: '',
    description: '',
    isActive: true,
  };

  menuId: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.menuId = Number(id);

      this.isEditMode = true;

      this.loadMenu();
    }
  }

  loadMenu(): void {
    if (this.menuId == null) return;

    this.isLoading = true;

    this.menuService.getById(this.menuId).subscribe({
      next: (data) => {
        this.menu = {
          name: data.name,
          location: data.location,
          description: data.description,
          isActive: data.isActive,
        };

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage = 'Unable to load menu.';

        this.isLoading = false;
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.menu.name.trim()) {
      this.errorMessage = 'Menu name is required.';

      return;
    }

    if (!this.menu.location.trim()) {
      this.errorMessage = 'Location is required.';

      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      this.menuService.update(this.menuId!, this.menu).subscribe({
        next: () => {
          this.router.navigate(['/menus']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to update menu.';
        },
      });
    } else {
      this.menuService.create(this.menu).subscribe({
        next: () => {
          this.router.navigate(['/menus']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to save menu.';
        },
      });
    }
  }
}
