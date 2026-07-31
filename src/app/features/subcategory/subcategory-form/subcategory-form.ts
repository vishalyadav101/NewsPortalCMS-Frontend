import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SubCategoryService } from '../../../core/services/subcategory';
import { CategoryService } from '../../../core/services/category';

import { SubCategoryRequest } from '../../../core/models/subcategory.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-subcategory-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './subcategory-form.html',
  styleUrl: './subcategory-form.css',
})
export class SubcategoryForm implements OnInit {
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly categoryService = inject(CategoryService);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];

  subCategory: SubCategoryRequest = {
    categoryId: 0,
    name: '',
    slug: '',
    description: '',
    isActive: true,
    displayOrder: 0,
  };

  subCategoryId: number | null = null;

  isEditMode = false;
  isLoading = true;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading = true;

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;

        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
          this.subCategoryId = Number(id);
          this.isEditMode = true;

          this.loadSubCategory();
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },

      error: (error) => {
        console.error('Category GET error:', error);

        this.errorMessage = 'Unable to load categories.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  private loadSubCategory(): void {
    if (this.subCategoryId === null) {
      return;
    }

    this.subCategoryService.getById(this.subCategoryId).subscribe({
      next: (data) => {
        this.subCategory = {
          categoryId: data.categoryId,
          name: data.name,
          slug: data.slug,
          description: data.description ?? '',
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        };

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('SubCategory GET error:', error);

        this.errorMessage = 'Unable to load sub category.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.subCategory.categoryId) {
      this.errorMessage = 'Category is required.';
      return;
    }

    if (!this.subCategory.name.trim()) {
      this.errorMessage = 'Sub category name is required.';
      return;
    }

    if (!this.subCategory.slug.trim()) {
      this.errorMessage = 'Slug is required.';
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.subCategoryId !== null) {
      this.updateSubCategory();
    } else {
      this.createSubCategory();
    }
  }

  private createSubCategory(): void {
    this.subCategoryService.create(this.subCategory).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/subcategories']);
      },

      error: (error) => {
        console.error('Create SubCategory error:', error);
        this.handleError(error);
      },
    });
  }

  private updateSubCategory(): void {
    if (this.subCategoryId === null) {
      return;
    }

    this.subCategoryService.update(this.subCategoryId, this.subCategory).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/subcategories']);
      },

      error: (error) => {
        console.error('Update SubCategory error:', error);
        this.handleError(error);
      },
    });
  }

  private handleError(error: any): void {
    this.isSaving = false;

    if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Invalid sub category data.';
    } else {
      this.errorMessage = 'Unable to save sub category.';
    }

    this.cdr.detectChanges();
  }
}
