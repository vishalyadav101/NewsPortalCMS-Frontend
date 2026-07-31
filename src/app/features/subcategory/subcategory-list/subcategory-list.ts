import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SubCategoryService } from '../../../core/services/subcategory';
import { SubCategory } from '../../../core/models/subcategory.model';

@Component({
  selector: 'app-subcategory-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './subcategory-list.html',
  styleUrl: './subcategory-list.css',
})
export class SubcategoryList implements OnInit {
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly cdr = inject(ChangeDetectorRef);

  subCategories: SubCategory[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSubCategories();
  }

  loadSubCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subCategoryService.getAll().subscribe({
      next: (data) => {
        this.subCategories = data;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('SubCategory GET error:', error);

        this.errorMessage = 'Unable to load sub categories.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteSubCategory(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this sub category?');

    if (!confirmed) {
      return;
    }

    this.subCategoryService.delete(id).subscribe({
      next: () => {
        this.loadSubCategories();
      },

      error: (error) => {
        console.error('Delete SubCategory error:', error);
        alert('Unable to delete sub category.');
      },
    });
  }
}
