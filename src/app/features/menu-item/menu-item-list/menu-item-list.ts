import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MenuService } from '../../../core/services/menu';
import { MenuItemService } from '../../../core/services/menu-item';

import { Menu } from '../../../core/models/menu.model';
import { MenuItem } from '../../../core/models/menu-item.model';

@Component({
  selector: 'app-menu-item-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-item-list.html',
  styleUrl: './menu-item-list.css',
})
export class MenuItemList implements OnInit {
  private readonly menuService = inject(MenuService);

  private readonly menuItemService = inject(MenuItemService);

  private readonly cdr = inject(ChangeDetectorRef);

  menus: Menu[] = [];

  menuItems: MenuItem[] = [];

  selectedMenuId = 0;

  isLoading = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.menuService.getAll().subscribe({
      next: (data) => {
        this.menus = data;
      },
    });
  }

  loadMenuItems(): void {
    if (!this.selectedMenuId) {
      this.menuItems = [];

      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.menuItemService.getByMenu(this.selectedMenuId).subscribe({
      next: (data) => {
        this.menuItems = data;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load menu items.';

        this.isLoading = false;
      },
    });
  }

  deleteMenuItem(id: number): void {
    if (!confirm('Delete this menu item?')) return;

    this.menuItemService.delete(id).subscribe({
      next: () => {
        this.menuItems = this.menuItems.filter((x) => x.id !== id);
      },

      error: (error) => {
        alert(error.error?.message ?? 'Unable to delete menu item.');
      },
    });
  }
}
