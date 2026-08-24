import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { NewsService } from '../../../core/services/news';
import { News, NewsPagedResponse } from '../../../core/models/news.model';

@Component({
  selector: 'app-public-news-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-news-list.html',
  styleUrl: './public-news-list.css',
})
export class PublicNewsList implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // STATE
  // ==========================================

  newsList: News[] = [];

  isLoading = true;

  errorMessage = '';

  // ==========================================
  // PAGINATION
  // ==========================================

  pageNumber = 1;

  pageSize = 12;

  totalCount = 0;

  totalPages = 0;

  hasPreviousPage = false;

  hasNextPage = false;

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadNews();
  }

  // ==========================================
  // LOAD PUBLISHED NEWS
  // ==========================================

  loadNews(): void {
    console.log('Public News: Loading...');

    this.isLoading = true;
    this.errorMessage = '';

    this.newsService
      .getAllPaged(
        '',
        undefined,
        true,
        undefined,
        'publishDate_desc',
        this.pageNumber,
        this.pageSize,
      )
      .subscribe({
        next: (response: NewsPagedResponse) => {
          console.log('Public News API Response:', response);

          this.newsList = response?.items ?? [];

          this.pageNumber = response?.pageNumber ?? 1;
          this.pageSize = response?.pageSize ?? 12;
          this.totalCount = response?.totalCount ?? 0;
          this.totalPages = response?.totalPages ?? 0;
          this.hasPreviousPage = response?.hasPreviousPage ?? false;
          this.hasNextPage = response?.hasNextPage ?? false;

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Public News API Error:', error);

          this.newsList = [];

          this.totalCount = 0;
          this.totalPages = 0;
          this.hasPreviousPage = false;
          this.hasNextPage = false;

          this.errorMessage = 'Unable to load latest news. Please try again later.';

          this.isLoading = false;

          this.cdr.detectChanges();
        },
      });
  }

  // ==========================================
  // PREVIOUS PAGE
  // ==========================================

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }

    this.pageNumber--;

    this.loadNews();
  }

  // ==========================================
  // NEXT PAGE
  // ==========================================

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }

    this.pageNumber++;

    this.loadNews();
  }

  // ==========================================
  // IMAGE URL
  // ==========================================

  getImageUrl(imagePath: string | null): string {
    if (!imagePath || !imagePath.trim()) {
      return 'assets/images/no-image.png';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `https://localhost:7103${cleanPath}`;
  }

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src.includes('no-image.png')) {
      return;
    }

    image.src = 'assets/images/no-image.png';
  }

  // ==========================================
  // DATE FORMAT
  // ==========================================

  formatDate(date: string | null | undefined): string {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // ==========================================
  // TRACK BY
  // ==========================================

  trackByNewsId(index: number, news: News): number {
    return news.id;
  }
}
