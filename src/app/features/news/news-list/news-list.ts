import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NewsService } from '../../../core/services/news';
import { News, NewsPagedResponse } from '../../../core/models/news.model';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
})
export class NewsList implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly cdr = inject(ChangeDetectorRef);

  // =====================================================
  // NEWS DATA
  // =====================================================

  newsList: News[] = [];

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  isLoading = true;
  errorMessage = '';

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  search = '';

  categoryId: number | undefined = undefined;

  publishedFilter: string = 'all';

  featuredFilter: string = 'all';

  sortBy = '';

  // =====================================================
  // PAGINATION
  // =====================================================

  pageNumber = 1;

  pageSize = 12;

  totalCount = 0;

  totalPages = 0;

  hasPreviousPage = false;

  hasNextPage = false;

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadNews();
  }

  // =====================================================
  // LOAD NEWS
  // =====================================================

  loadNews(): void {
    this.isLoading = true;

    this.errorMessage = '';

    // Published filter
    let isPublished: boolean | undefined;

    if (this.publishedFilter === 'published') {
      isPublished = true;
    }

    if (this.publishedFilter === 'unpublished') {
      isPublished = false;
    }

    // Featured filter
    let isFeatured: boolean | undefined;

    if (this.featuredFilter === 'featured') {
      isFeatured = true;
    }

    if (this.featuredFilter === 'not-featured') {
      isFeatured = false;
    }

    this.newsService
      .getAllPaged(
        this.search,
        this.categoryId,
        isPublished,
        isFeatured,
        this.sortBy,
        this.pageNumber,
        this.pageSize,
      )
      .subscribe({
        next: (data: NewsPagedResponse) => {
          console.log('News API Response:', data);

          // IMPORTANT:
          // Backend returns { items: [...] }

          this.newsList = data.items;

          // Pagination data

          this.pageNumber = data.pageNumber;

          this.pageSize = data.pageSize;

          this.totalCount = data.totalCount;

          this.totalPages = data.totalPages;

          this.hasPreviousPage = data.hasPreviousPage;

          this.hasNextPage = data.hasNextPage;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('News GET error:', error);

          this.newsList = [];

          this.errorMessage = 'Unable to load news.';

          this.isLoading = false;

          this.cdr.detectChanges();
        },
      });
  }

  // =====================================================
  // SEARCH
  // =====================================================

  applySearch(): void {
    this.pageNumber = 1;

    this.loadNews();
  }

  // =====================================================
  // FILTER
  // =====================================================

  applyFilters(): void {
    this.pageNumber = 1;

    this.loadNews();
  }

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  clearFilters(): void {
    this.search = '';

    this.categoryId = undefined;

    this.publishedFilter = 'all';

    this.featuredFilter = 'all';

    this.sortBy = '';

    this.pageNumber = 1;

    this.loadNews();
  }

  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }

    this.pageNumber--;

    this.loadNews();
  }

  // =====================================================
  // NEXT PAGE
  // =====================================================

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }

    this.pageNumber++;

    this.loadNews();
  }

  // =====================================================
  // DELETE NEWS
  // =====================================================

  deleteNews(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this news?');

    if (!confirmed) {
      return;
    }

    this.newsService.delete(id).subscribe({
      next: () => {
        this.loadNews();
      },

      error: (error) => {
        console.error('Delete News error:', error);

        alert('Unable to delete news.');
      },
    });
  }

  // =====================================================
  // IMAGE URL
  // =====================================================

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/images/no-image.png';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    return `https://localhost:7103${imagePath}`;
  }
}
