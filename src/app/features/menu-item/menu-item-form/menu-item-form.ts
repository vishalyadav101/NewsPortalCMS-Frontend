import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MenuService } from '../../../core/services/menu';
import { MenuItemService } from '../../../core/services/menu-item';

import { Menu } from '../../../core/models/menu.model';

import { MenuItem, MenuItemRequest } from '../../../core/models/menu-item.model';

@Component({
  selector: 'app-menu-item-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-item-form.html',
  styleUrl: './menu-item-form.css',
})
export class MenuItemForm implements OnInit {
  private readonly menuService = inject(MenuService);

  private readonly menuItemService = inject(MenuItemService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  menus: Menu[] = [];

  parentItems: MenuItem[] = [];

  menuItem: MenuItemRequest = {
    menuId: 0,
    parentId: null,
    title: '',
    url: '',
    icon: '',
    target: '_self',
    displayOrder: 1,
    isActive: true,
  };

  menuItemId: number | null = null;

  isEditMode = false;

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadMenus();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.menuItemId = Number(id);

      this.isEditMode = true;

      this.loadMenuItem();
    }
  }

  loadMenus(): void {
    this.menuService.getAll().subscribe({
      next: (data) => {
        this.menus = data;
      },
    });
  }

  loadParentItems(): void {
    if (!this.menuItem.menuId) return;

    this.menuItemService.getByMenu(this.menuItem.menuId).subscribe({
      next: (data) => {
        this.parentItems = data;
      },
    });
  }

  loadMenuItem(): void {
    if (!this.menuItemId) return;

    this.isLoading = true;

    this.menuItemService.getById(this.menuItemId).subscribe({
      next: (data) => {
        this.menuItem = {
          menuId: data.menuId,
          parentId: data.parentId,
          title: data.title,
          url: data.url,
          icon: data.icon,
          target: data.target,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        };

        this.loadParentItems();

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage = 'Unable to load menu item.';

        this.isLoading = false;
      },
    });
  }

  save(): void {
    if (!this.menuItem.title.trim()) {
      this.errorMessage = 'Title is required.';

      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      this.menuItemService.update(this.menuItemId!, this.menuItem).subscribe({
        next: () => {
          this.router.navigate(['/menu-items']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to update menu item.';
        },
      });
    } else {
      this.menuItemService.create(this.menuItem).subscribe({
        next: () => {
          this.router.navigate(['/menu-items']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to save menu item.';
        },
      });
    }
  }
}
