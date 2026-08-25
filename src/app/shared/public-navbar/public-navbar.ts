import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
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

    console.log(
      'CATEGORY CLICKED:',
      categoryId
    );


    // -------------------------------------------------------
    // CLOSE IF SAME CATEGORY IS CLICKED
    // -------------------------------------------------------

    if (
      this.openedCategoryId === categoryId
    ) {

      this.openedCategoryId = null;

      this.selectedSubcategories = [];

      this.isSubcategoryLoading = false;

      return;

    }


    // -------------------------------------------------------
    // OPEN CATEGORY
    // -------------------------------------------------------

    this.openedCategoryId = categoryId;

    this.isMoreOpen = false;

    this.selectedSubcategories = [];

    this.isSubcategoryLoading = true;


    console.log(
      'GETTING SUBCATEGORIES FOR CATEGORY:',
      categoryId
    );


    // -------------------------------------------------------
    // CALL API
    // -------------------------------------------------------

    this.subcategoryService
      .getSubcategoriesByCategory(categoryId)
      .subscribe({

        next: (
          subcategories: PublicSubcategory[]
        ) => {

          console.log(
            'SUBCATEGORIES RECEIVED:',
            subcategories
          );


          this.selectedSubcategories =
            subcategories;


          this.isSubcategoryLoading =
            false;


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