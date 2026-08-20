import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NewsService } from '../../../core/services/news';
import { CategoryService } from '../../../core/services/category';
import { SubCategoryService } from '../../../core/services/subcategory';

import { NewsRequest } from '../../../core/models/news.model';
import { Category } from '../../../core/models/category.model';
import { SubCategory } from '../../../core/models/subcategory.model';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './news-form.html',
  styleUrl: './news-form.css',
})
export class NewsForm implements OnInit {
  // ==========================================
  // SERVICES
  // ==========================================

  private readonly newsService = inject(NewsService);

  private readonly categoryService = inject(CategoryService);

  private readonly subCategoryService = inject(SubCategoryService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // CATEGORIES
  // ==========================================

  categories: Category[] = [];

  // ==========================================
  // SUB CATEGORIES
  // ==========================================

  subCategories: SubCategory[] = [];

  filteredSubCategories: SubCategory[] = [];

  // ==========================================
  // NEWS MODEL
  // ==========================================

  news: NewsRequest = {
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    featuredImage: null,
    featuredVideo: null,
    author: '',
    publishDate: '',
    isPublished: true,
    isFeatured: false,
    categoryId: 0,
    subCategoryId: 0,
  };

  // ==========================================
  // EDIT MODE
  // ==========================================

  newsId: number | null = null;

  isEditMode = false;

  // ==========================================
  // STATES
  // ==========================================

  isLoading = true;

  isSaving = false;

  errorMessage = '';

  // ==========================================
  // PREVIEWS
  // ==========================================

  selectedImagePreview = '';

  selectedVideoPreview = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.newsId = Number(id);

      this.isEditMode = true;
    }

    this.loadCategories();
  }

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        console.log('Categories:', data);

        this.categories = data;

        this.loadAllSubCategories();
      },

      error: (error) => {
        console.error('Category GET Error:', error);

        this.errorMessage = 'Unable to load categories.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // LOAD ALL SUB CATEGORIES
  // ==========================================

  private loadAllSubCategories(): void {
    this.subCategoryService.getAll().subscribe({
      next: (data) => {
        console.log('Sub Categories:', data);

        this.subCategories = data;

        /*
         * Edit mode me news load hone ke baad
         * selected category ke according
         * sub categories filter hongi.
         */

        if (this.isEditMode) {
          this.loadNews();
        } else {
          this.setDefaultPublishDate();

          this.isLoading = false;

          this.cdr.detectChanges();
        }
      },

      error: (error) => {
        console.error('Sub Category GET Error:', error);

        this.errorMessage = 'Unable to load sub categories.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  onCategoryChange(): void {
    console.log('Selected Category:', this.news.categoryId);

    /*
     * Category select hone par
     * us category ki sub categories filter karenge.
     */

    this.filteredSubCategories = this.subCategories.filter(
      (subCategory) => subCategory.categoryId === this.news.categoryId,
    );

    console.log('Filtered Sub Categories:', this.filteredSubCategories);

    /*
     * Category change hone par purani
     * sub category remove kar denge.
     */

    this.news.subCategoryId = 0;

    this.cdr.detectChanges();
  }

  // ==========================================
  // LOAD NEWS FOR EDIT
  // ==========================================

  private loadNews(): void {
    if (this.newsId === null) {
      return;
    }

    this.newsService.getById(this.newsId).subscribe({
      next: (data) => {
        console.log('News Details:', data);

        this.news = {
          title: data.title,

          slug: data.slug,

          shortDescription: data.shortDescription ?? '',

          content: data.content ?? '',

          featuredImage: null,

          featuredVideo: null,

          author: data.author ?? '',

          publishDate: this.formatDateForInput(data.publishDate),

          isPublished: data.isPublished,

          isFeatured: data.isFeatured,

          categoryId: data.categoryId,

          subCategoryId: data.subCategoryId ?? 0,
        };

        /*
         * Existing category ke according
         * sub categories show karenge.
         */

        this.filteredSubCategories = this.subCategories.filter(
          (subCategory) => subCategory.categoryId === this.news.categoryId,
        );

        // ==========================================
        // IMAGE PREVIEW
        // ==========================================

        this.selectedImagePreview = data.featuredImage
          ? `https://localhost:7103${data.featuredImage}`
          : '';

        // ==========================================
        // VIDEO / PDF PREVIEW
        // ==========================================

        this.selectedVideoPreview = data.featuredVideo
          ? `https://localhost:7103${data.featuredVideo}`
          : '';

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('News GET Error:', error);

        this.errorMessage = 'Unable to load news.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // DEFAULT PUBLISH DATE
  // ==========================================

  private setDefaultPublishDate(): void {
    const now = new Date();

    const offset = now.getTimezoneOffset() * 60000;

    this.news.publishDate = new Date(now.getTime() - offset).toISOString().slice(0, 16);
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  private formatDateForInput(date: string): string {
    if (!date) {
      return '';
    }

    return date.slice(0, 16);
  }

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.news.featuredImage = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImagePreview = reader.result as string;

      this.cdr.detectChanges();
    };

    reader.readAsDataURL(input.files[0]);
  }

  // ==========================================
  // VIDEO / PDF SELECT
  // ==========================================

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.news.featuredVideo = input.files[0];

    const file = input.files[0];

    if (file.type === 'application/pdf') {
      this.selectedVideoPreview = 'assets/icons/pdf.png';
    } else {
      this.selectedVideoPreview = URL.createObjectURL(file);
    }

    this.cdr.detectChanges();
  }

  // ==========================================
  // SAVE
  // ==========================================

  save(): void {
    this.errorMessage = '';

    // ==========================================
    // TITLE
    // ==========================================

    if (!this.news.title.trim()) {
      this.errorMessage = 'Title is required.';

      return;
    }

    // ==========================================
    // SLUG
    // ==========================================

    if (!this.news.slug.trim()) {
      this.errorMessage = 'Slug is required.';

      return;
    }

    // ==========================================
    // CATEGORY
    // ==========================================

    if (!this.news.categoryId) {
      this.errorMessage = 'Category is required.';

      return;
    }

    // ==========================================
    // SUB CATEGORY
    // ==========================================

    /*
     * Abhi subCategory optional rakha hai.
     *
     * Agar backend me compulsory hai to
     * yahan validation add kar sakte hain.
     */

    // ==========================================
    // AUTHOR
    // ==========================================

    if (!this.news.author.trim()) {
      this.errorMessage = 'Author is required.';

      return;
    }

    // ==========================================
    // PUBLISH DATE
    // ==========================================

    if (!this.news.publishDate) {
      this.errorMessage = 'Publish date is required.';

      return;
    }

    // ==========================================
    // SAVING
    // ==========================================

    this.isSaving = true;

    const request: NewsRequest = {
      ...this.news,

      publishDate: new Date(this.news.publishDate).toISOString(),
    };

    console.log('News Request:', request);

    // ==========================================
    // UPDATE
    // ==========================================

    if (this.isEditMode && this.newsId !== null) {
      this.updateNews(request);

      return;
    }

    // ==========================================
    // CREATE
    // ==========================================

    this.createNews(request);
  }

  // ==========================================
  // CREATE NEWS
  // ==========================================

  private createNews(request: NewsRequest): void {
    this.newsService.create(request).subscribe({
      next: (response) => {
        console.log('News Created:', response);

        this.isSaving = false;

        this.router.navigate(['/news']);
      },

      error: (error) => {
        console.error('Create News error:', error);

        this.handleError(error);
      },
    });
  }

  // ==========================================
  // UPDATE NEWS
  // ==========================================

  private updateNews(request: NewsRequest): void {
    if (this.newsId === null) {
      return;
    }

    this.newsService.update(this.newsId, request).subscribe({
      next: (response) => {
        console.log('News Updated:', response);

        this.isSaving = false;

        this.router.navigate(['/news']);
      },

      error: (error) => {
        console.error('Update News error:', error);

        this.handleError(error);
      },
    });
  }

  // ==========================================
  // ERROR HANDLING
  // ==========================================

  private handleError(error: any): void {
    this.isSaving = false;

    if (error.status === 400) {
      this.errorMessage = error.error?.message || 'Invalid news data.';
    } else {
      this.errorMessage = 'Unable to save news.';
    }

    this.cdr.detectChanges();
  }
}
