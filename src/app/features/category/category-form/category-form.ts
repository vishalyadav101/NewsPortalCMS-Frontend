import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CategoryService } from '../../../core/services/category';
import { CategoryRequest } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  category: CategoryRequest = {
    name: '',
    slug: '',
    description: '',
    isActive: true,
    displayOrder: 0,
  };

  categoryId: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.categoryId = Number(id);
      this.isEditMode = true;

      this.loadCategory();
    }
  }

  loadCategory(): void {
    if (this.categoryId === null) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getById(this.categoryId).subscribe({
      next: (data) => {
        this.category = {
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
        console.error('Load category error:', error);

        this.errorMessage = 'Unable to load category.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.category.name.trim()) {
      this.errorMessage = 'Category name is required.';
      return;
    }

    if (!this.category.slug.trim()) {
      this.errorMessage = 'Slug is required.';
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.categoryId !== null) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  private createCategory(): void {
    this.categoryService.create(this.category).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/categories']);
      },

      error: (error) => {
        console.error('Create category error:', error);
        this.handleSaveError(error);
      },
    });
  }

  private updateCategory(): void {
    if (this.categoryId === null) {
      return;
    }

    this.categoryService.update(this.categoryId, this.category).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/categories']);
      },

      error: (error) => {
        console.error('Update category error:', error);
        this.handleSaveError(error);
      },
    });
  }

  private handleSaveError(error: any): void {
    this.isSaving = false;

    if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Invalid category data.';
    } else {
      this.errorMessage = 'Unable to save category.';
    }

    this.cdr.detectChanges();
  }
}
