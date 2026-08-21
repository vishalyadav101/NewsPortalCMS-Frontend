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
    console.log('====================================');
    console.log('NEWS FORM INITIALIZED');
    console.log('====================================');

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.newsId = Number(id);

      this.isEditMode = true;

      console.log('Edit Mode:', this.newsId);
    }

    this.loadCategories();
  }

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  private loadCategories(): void {
    console.log('Loading categories...');

    this.categoryService.getAll().subscribe({
      next: (data) => {
        console.log('Categories:', data);

        this.categories = data;

        this.loadAllSubCategories();
      },

      error: (error) => {
        console.error('Category GET Error:', error);

        this.errorMessage = error?.error?.message || 'Unable to load categories.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // LOAD ALL SUB CATEGORIES
  // ==========================================

  private loadAllSubCategories(): void {
    console.log('Loading sub categories...');

    this.subCategoryService.getAll().subscribe({
      next: (data) => {
        console.log('Sub Categories:', data);

        this.subCategories = data;

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

        this.errorMessage = error?.error?.message || 'Unable to load sub categories.';

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

    this.filteredSubCategories = this.subCategories.filter(
      (subCategory) => subCategory.categoryId === this.news.categoryId,
    );

    console.log('Filtered Sub Categories:', this.filteredSubCategories);

    // Reset sub-category

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

    console.log('Loading news:', this.newsId);

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

        // ==========================================
        // FILTER SUB CATEGORIES
        // ==========================================

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
        // VIDEO PREVIEW
        // ==========================================

        this.selectedVideoPreview = data.featuredVideo
          ? `https://localhost:7103${data.featuredVideo}`
          : '';

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('News GET Error:', error);

        this.errorMessage = error?.error?.message || 'Unable to load news.';

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

    console.log('Default Publish Date:', this.news.publishDate);
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

    const file = input.files[0];

    console.log('Selected Image:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    this.news.featuredImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImagePreview = reader.result as string;

      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  // ==========================================
  // VIDEO / PDF SELECT
  // ==========================================

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    console.log('Selected Video:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    this.news.featuredVideo = file;

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
    console.log('====================================');

    console.log('SAVE NEWS STARTED');

    console.log('====================================');

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
    // CONTENT
    // ==========================================

    if (!this.news.content.trim()) {
      this.errorMessage = 'Content is required.';

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
    // CHECK DATE
    // ==========================================

    const parsedDate = new Date(this.news.publishDate);

    if (isNaN(parsedDate.getTime())) {
      this.errorMessage = 'Invalid publish date.';

      return;
    }

    // ==========================================
    // SAVING
    // ==========================================

    this.isSaving = true;

    // ==========================================
    // CREATE REQUEST
    // ==========================================

    const request: NewsRequest = {
      ...this.news,

      title: this.news.title.trim(),

      slug: this.news.slug.trim(),

      shortDescription: this.news.shortDescription?.trim() ?? '',

      content: this.news.content,

      author: this.news.author.trim(),

      publishDate: parsedDate.toISOString(),

      isPublished: this.news.isPublished === true,

      isFeatured: this.news.isFeatured === true,

      categoryId: Number(this.news.categoryId),

      subCategoryId: this.news.subCategoryId ? Number(this.news.subCategoryId) : 0,
    };

    console.log('====================================');

    console.log('FINAL NEWS REQUEST');

    console.log('====================================');

    console.log('Request:', request);

    console.log('Title:', request.title);

    console.log('Slug:', request.slug);

    console.log('CategoryId:', request.categoryId);

    console.log('SubCategoryId:', request.subCategoryId);

    console.log('PublishDate:', request.publishDate);

    console.log('IsPublished:', request.isPublished);

    console.log('IsFeatured:', request.isFeatured);

    console.log('FeaturedImage:', request.featuredImage);

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
    console.log('POST /api/News starting...');

    this.newsService.create(request).subscribe({
      next: (response) => {
        console.log('====================================');

        console.log('NEWS CREATED SUCCESSFULLY');

        console.log('====================================');

        console.log('Response:', response);

        this.isSaving = false;

        this.router.navigate(['/news']);
      },

      error: (error) => {
        console.error('====================================');

        console.error('CREATE NEWS ERROR');

        console.error('====================================');

        console.error('Status:', error?.status);

        console.error('Status Text:', error?.statusText);

        console.error('Error Body:', error?.error);

        console.error('Full Error:', error);

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

    console.log('PUT /api/News/' + this.newsId);

    this.newsService.update(this.newsId, request).subscribe({
      next: (response) => {
        console.log('News Updated:', response);

        this.isSaving = false;

        this.router.navigate(['/news']);
      },

      error: (error) => {
        console.error('UPDATE NEWS ERROR');

        console.error('Status:', error?.status);

        console.error('Status Text:', error?.statusText);

        console.error('Error Body:', error?.error);

        console.error('Full Error:', error);

        this.handleError(error);
      },
    });
  }

  // ==========================================
  // ERROR HANDLING
  // ==========================================

  private handleError(error: any): void {
    this.isSaving = false;

    console.error('Handling Error:', error);

    // ==========================================
    // 400
    // ==========================================

    if (error?.status === 400) {
      const validationErrors = error?.error?.errors;

      if (validationErrors) {
        const messages: string[] = [];

        Object.keys(validationErrors).forEach((key) => {
          const errors = validationErrors[key];

          if (Array.isArray(errors)) {
            messages.push(...errors);
          }
        });

        if (messages.length > 0) {
          this.errorMessage = messages.join(' | ');
        } else {
          this.errorMessage = error?.error?.message || 'Invalid news data.';
        }
      } else {
        this.errorMessage = error?.error?.message || error?.error?.title || 'Invalid news data.';
      }

      // ==========================================
      // 401
      // ==========================================
    } else if (error?.status === 401) {
      this.errorMessage = 'Unauthorized. Please login again.';

      // ==========================================
      // 403
      // ==========================================
    } else if (error?.status === 403) {
      this.errorMessage = 'You do not have permission to create news.';

      // ==========================================
      // 404
      // ==========================================
    } else if (error?.status === 404) {
      this.errorMessage = 'News API endpoint not found.';

      // ==========================================
      // 409
      // ==========================================
    } else if (error?.status === 409) {
      this.errorMessage = error?.error?.message || 'A news article with this data already exists.';

      // ==========================================
      // 500
      // ==========================================
    } else if (error?.status >= 500) {
      this.errorMessage =
        error?.error?.message || error?.error?.title || 'Server error while saving news.';

      // ==========================================
      // NETWORK / CORS
      // ==========================================
    } else if (error?.status === 0) {
      this.errorMessage = 'Unable to connect to News API. Check backend, HTTPS or CORS.';

      // ==========================================
      // OTHER
      // ==========================================
    } else {
      this.errorMessage =
        error?.error?.message || error?.error?.title || error?.message || 'Unable to save news.';
    }

    console.error('Final Error Message:', this.errorMessage);

    this.cdr.detectChanges();
  }
}
