import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  PublicCategoryService,
  PublicCategory
} from '../../core/services/public-category';

import {
  PublicSubcategoryService,
  PublicSubcategory
} from '../../core/services/public-subcategory';

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
export class PublicNavbar {

  private readonly categoryService =
    inject(PublicCategoryService);

  private readonly subcategoryService =
    inject(PublicSubcategoryService);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

    private readonly router = inject(Router);


  // =========================================================
  // MENU STATE
  // =========================================================

  isMobileMenuOpen = false;

  isMoreOpen = false;

  openedCategoryId: number | null = null;


  // =========================================================
  // CATEGORIES
  // =========================================================

  visibleCategories: PublicCategory[] = [];

  moreCategories: PublicCategory[] = [];


  // =========================================================
  // SUBCATEGORIES
  // =========================================================

  selectedSubcategories: PublicSubcategory[] = [];

  isSubcategoryLoading = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor() {

    this.loadCategories();

  }


  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  private loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (categories: PublicCategory[]) => {

        console.log(
          'PUBLIC CATEGORIES:',
          categories
        );

        const sortedCategories =
          [...categories].sort(
            (a, b) =>
              a.displayOrder - b.displayOrder
          );


        this.visibleCategories =
          sortedCategories.slice(0, 10);


        this.moreCategories =
          sortedCategories.slice(10);


        console.log(
          'VISIBLE CATEGORIES:',
          this.visibleCategories
        );


        console.log(
          'MORE CATEGORIES:',
          this.moreCategories
        );


        /*
         * Tell Angular that the API response has
         * changed the data used by the template.
         */
        this.changeDetector.detectChanges();

      },

      error: (error) => {

        console.error(
          'PUBLIC CATEGORY API ERROR:',
          error
        );

      }

    });

  }



// =========================================================
// CATEGORY CLICK
// =========================================================

toggleCategory(categoryId: number): void {

  console.log('CATEGORY CLICKED:', categoryId);

  // -------------------------------------------------------
  // CLOSE IF SAME CATEGORY IS CLICKED
  // -------------------------------------------------------

  if (this.openedCategoryId === categoryId) {

    this.openedCategoryId = null;

    this.selectedSubcategories = [];

    this.isSubcategoryLoading = false;

    return;
  }

  // -------------------------------------------------------
  // OPEN CATEGORY
  // -------------------------------------------------------

  this.openedCategoryId = categoryId;

  this.selectedSubcategories = [];

  this.isSubcategoryLoading = true;

  // -------------------------------------------------------
  // IMPORTANT:
  // Keep MORE OPEN when category belongs to MORE section.
  // Otherwise the More dropdown closes before its
  // subcategories can be displayed.
  // -------------------------------------------------------

  const isMoreCategory = this.moreCategories.some(
    category => category.id === categoryId
  );

  if (!isMoreCategory) {
    this.isMoreOpen = false;
  }

  // -------------------------------------------------------
  // GET SUBCATEGORIES
  // -------------------------------------------------------

  console.log(
    'GETTING SUBCATEGORIES FOR CATEGORY:',
    categoryId
  );

  this.subcategoryService
    .getSubcategoriesByCategory(categoryId)
    .subscribe({

      next: (subcategories: PublicSubcategory[]) => {

        console.log(
          'SUBCATEGORIES RECEIVED:',
          subcategories
        );

        this.selectedSubcategories = subcategories;

        this.isSubcategoryLoading = false;

        this.changeDetector.detectChanges();

        console.log(
          'SELECTED SUBCATEGORIES:',
          this.selectedSubcategories
        );
      },

      error: (error) => {

        console.error(
          'SUBCATEGORY API ERROR:',
          error
        );

        this.selectedSubcategories = [];

        this.isSubcategoryLoading = false;

        this.changeDetector.detectChanges();
      }

    });
}


  // =========================================================
// SUBCATEGORY CLICK
// =========================================================

openSubcategory(subcategoryId: number): void {

  console.log(
    'SUBCATEGORY CLICKED:',
    subcategoryId
  );

  // Navigate to public news page
  // with selected subcategory ID
  this.router.navigate(
    ['/public/news'],
    {
      queryParams: {
        subcategoryId: subcategoryId
      }
    }
  );

  // Close opened menus
  this.openedCategoryId = null;
  this.isMoreOpen = false;
  this.isMobileMenuOpen = false;
  this.selectedSubcategories = [];
  this.isSubcategoryLoading = false;
}

  // =========================================================
  // MORE
  // =========================================================

  toggleMore(): void {

    this.isMoreOpen =
      !this.isMoreOpen;


    this.openedCategoryId =
      null;


    this.selectedSubcategories =
      [];


    this.isSubcategoryLoading =
      false;

  }


  // =========================================================
  // MOBILE MENU
  // =========================================================

  toggleMobileMenu(): void {

    this.isMobileMenuOpen =
      !this.isMobileMenuOpen;

  }


  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  closeMobileMenu(): void {

    this.isMobileMenuOpen = false;

    this.isMoreOpen = false;

    this.openedCategoryId = null;

    this.selectedSubcategories = [];

    this.isSubcategoryLoading = false;

  }


  // =========================================================
  // CLOSE CATEGORY
  // =========================================================

  closeCategory(): void {

    this.openedCategoryId = null;

    this.isMoreOpen = false;

    this.isMobileMenuOpen = false;

    this.selectedSubcategories = [];

    this.isSubcategoryLoading = false;

  }

}