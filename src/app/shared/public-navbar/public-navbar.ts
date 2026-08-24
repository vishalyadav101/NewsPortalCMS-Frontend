import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  PublicCategoryService,
  PublicCategory
} from '../../core/services/public-category';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.css'
})
export class PublicNavbar implements AfterViewInit {

  private readonly categoryService =
    inject(PublicCategoryService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  isMobileMenuOpen = false;
  isMoreOpen = false;

  categories: PublicCategory[] = [];

  visibleCategories: PublicCategory[] = [];

  moreCategories: PublicCategory[] = [];


  // Load categories after the initial view has been checked
  ngAfterViewInit(): void {
    this.loadCategories();
  }


  loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (data: PublicCategory[]) => {

        console.log('Public Categories:', data);

        // Sort categories by display order
        const sorted = [...data].sort(
          (a, b) => a.displayOrder - b.displayOrder
        );

        // All categories
        this.categories = sorted;

        // Show maximum 10 categories
        this.visibleCategories = sorted.slice(0, 10);

        // Remaining categories
        this.moreCategories = sorted.slice(10);

        // Tell Angular that the values have changed
        this.cdr.detectChanges();
      },


      error: (error) => {

        console.error(
          'Public Categories API Error:',
          error
        );

        this.categories = [];
        this.visibleCategories = [];
        this.moreCategories = [];

        this.cdr.detectChanges();
      }

    });

  }


  toggleMobileMenu(): void {

    this.isMobileMenuOpen =
      !this.isMobileMenuOpen;

  }


  closeMobileMenu(): void {

    this.isMobileMenuOpen = false;
    this.isMoreOpen = false;

  }


  toggleMore(): void {

    this.isMoreOpen =
      !this.isMoreOpen;

  }

}