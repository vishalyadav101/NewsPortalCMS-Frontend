import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CategoryService } from '../../../core/services/category';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Category GET error:', error);

        this.errorMessage = 'Unable to load categories.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteCategory(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this category?');

    if (!confirmed) {
      return;
    }

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.loadCategories();
      },

      error: (error) => {
        console.error('Category delete error:', error);
        alert('Category could not be deleted.');
      },
    });
  }
}
