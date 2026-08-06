import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MenuService } from '../../../core/services/menu';
import { Menu } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.css',
})
export class MenuList implements OnInit {
  private readonly menuService = inject(MenuService);

  private readonly cdr = inject(ChangeDetectorRef);

  menus: Menu[] = [];

  isLoading = true;

  errorMessage = '';

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.menuService.getAll().subscribe({
      next: (data) => {
        this.menus = data;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load menus.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteMenu(id: number): void {
    const confirmed = confirm('Delete this menu?');

    if (!confirmed) return;

    this.menuService.delete(id).subscribe({
      next: () => {
        this.menus = this.menus.filter((x) => x.id !== id);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        alert(error.error?.message ?? 'Unable to delete menu.');
      },
    });
  }
}
