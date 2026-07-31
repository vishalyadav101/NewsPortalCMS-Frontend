import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NewsService } from '../../../core/services/news';
import { CategoryService } from '../../../core/services/category';

import { NewsRequest } from '../../../core/models/news.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-news-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './news-form.html',
  styleUrl: './news-form.css',
})
export class NewsForm implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly categoryService = inject(CategoryService);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];

  news: NewsRequest = {
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    featuredImage: '',
    author: '',
    publishDate: '',
    isPublished: true,
    categoryId: 0,
  };

  newsId: number | null = null;

  isEditMode = false;
  isLoading = true;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.newsId = Number(id);
      this.isEditMode = true;
    }

    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;

        if (this.isEditMode) {
          this.loadNews();
        } else {
          this.setDefaultPublishDate();
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

  private loadNews(): void {
    if (this.newsId === null) {
      return;
    }

    this.newsService.getById(this.newsId).subscribe({
      next: (data) => {
        this.news = {
          title: data.title,
          slug: data.slug,
          shortDescription: data.shortDescription ?? '',
          content: data.content ?? '',
          featuredImage: data.featuredImage ?? '',
          author: data.author ?? '',
          publishDate: this.formatDateForInput(data.publishDate),
          isPublished: data.isPublished,
          categoryId: data.categoryId,
        };

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('News GET error:', error);

        this.errorMessage = 'Unable to load news.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private setDefaultPublishDate(): void {
    const now = new Date();

    const offset = now.getTimezoneOffset() * 60000;

    this.news.publishDate = new Date(now.getTime() - offset).toISOString().slice(0, 16);
  }

  private formatDateForInput(date: string): string {
    if (!date) {
      return '';
    }

    return date.slice(0, 16);
  }

  save(): void {
    this.errorMessage = '';

    if (!this.news.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    if (!this.news.slug.trim()) {
      this.errorMessage = 'Slug is required.';
      return;
    }

    if (!this.news.categoryId) {
      this.errorMessage = 'Category is required.';
      return;
    }

    if (!this.news.author.trim()) {
      this.errorMessage = 'Author is required.';
      return;
    }

    if (!this.news.publishDate) {
      this.errorMessage = 'Publish date is required.';
      return;
    }

    this.isSaving = true;

    const request: NewsRequest = {
      ...this.news,
      publishDate: new Date(this.news.publishDate).toISOString(),
    };

    if (this.isEditMode && this.newsId !== null) {
      this.updateNews(request);
    } else {
      this.createNews(request);
    }
  }

  private createNews(request: NewsRequest): void {
    this.newsService.create(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/news']);
      },

      error: (error) => {
        console.error('Create News error:', error);
        this.handleError(error);
      },
    });
  }

  private updateNews(request: NewsRequest): void {
    if (this.newsId === null) {
      return;
    }

    this.newsService.update(this.newsId, request).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/news']);
      },

      error: (error) => {
        console.error('Update News error:', error);
        this.handleError(error);
      },
    });
  }

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
