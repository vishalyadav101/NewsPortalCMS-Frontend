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

  // IMPORTANT:
  // Latest news first
  sortBy = 'publishDate_desc';

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
    console.log('====================================');
    console.log('Admin News List: Loading news...');
    console.log('Page:', this.pageNumber);
    console.log('Page Size:', this.pageSize);
    console.log('Sort:', this.sortBy);
    console.log('Search:', this.search);
    console.log('Category:', this.categoryId);
    console.log('Published Filter:', this.publishedFilter);
    console.log('Featured Filter:', this.featuredFilter);
    console.log('====================================');

    this.isLoading = true;
    this.errorMessage = '';

    // ===================================================
    // PUBLISHED FILTER
    // ===================================================

    let isPublished: boolean | undefined;

    if (this.publishedFilter === 'published') {
      isPublished = true;
    }

    if (this.publishedFilter === 'unpublished') {
      isPublished = false;
    }

    // ===================================================
    // FEATURED FILTER
    // ===================================================

    let isFeatured: boolean | undefined;

    if (this.featuredFilter === 'featured') {
      isFeatured = true;
    }

    if (this.featuredFilter === 'not-featured') {
      isFeatured = false;
    }

    // ===================================================
    // API CALL
    // ===================================================

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
        // =================================================
        // SUCCESS
        // =================================================

        next: (data: NewsPagedResponse) => {
          console.log('Admin News API Response:', data);

          // -----------------------------------------------
          // NEWS ITEMS
          // -----------------------------------------------

          this.newsList = data?.items ?? [];

          console.log('Admin News Count On Current Page:', this.newsList.length);

          console.log('Admin Total News:', data?.totalCount ?? 0);

          // -----------------------------------------------
          // PAGINATION
          // -----------------------------------------------

          this.pageNumber = data?.pageNumber ?? 1;

          this.pageSize = data?.pageSize ?? 12;

          this.totalCount = data?.totalCount ?? 0;

          this.totalPages = data?.totalPages ?? 0;

          this.hasPreviousPage = data?.hasPreviousPage ?? false;

          this.hasNextPage = data?.hasNextPage ?? false;

          // -----------------------------------------------
          // LOADING COMPLETE
          // -----------------------------------------------

          this.isLoading = false;

          this.cdr.detectChanges();

          console.log('Admin News List Loaded Successfully.');
        },

        // =================================================
        // ERROR
        // =================================================

        error: (error) => {
          console.error('Admin News GET error:', error);

          this.newsList = [];

          this.totalCount = 0;

          this.totalPages = 0;

          this.hasPreviousPage = false;

          this.hasNextPage = false;

          this.errorMessage = 'Unable to load news. Please try again later.';

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

    // Latest first
    this.sortBy = 'publishDate_desc';

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
        console.log('News deleted successfully:', id);

        // If last item of current page was deleted,
        // go back one page when necessary.
        if (this.newsList.length === 1 && this.pageNumber > 1) {
          this.pageNumber--;
        }

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

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `https://localhost:7103${cleanPath}`;
  }
}
