import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { PublicNewsService } from '../../../core/services/public-news';
import { PublicNews } from '../../../core/models/public-news.model';

import { PublicCategoryService, PublicCategory } from '../../../core/services/public-category';

@Component({
  selector: 'app-public-news-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-news-list.html',
  styleUrl: './public-news-list.css',
})
export class PublicNewsList implements OnInit {
  // =========================================================
  // SERVICES
  // =========================================================

  private readonly publicNewsService = inject(PublicNewsService);

  private readonly publicCategoryService = inject(PublicCategoryService);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  // =========================================================
  // STATE
  // =========================================================

  newsList: PublicNews[] = [];

  isLoading = true;

  errorMessage = '';

  // =========================================================
  // CATEGORY
  // =========================================================

  categorySlug: string | null = null;

  selectedCategory: PublicCategory | null = null;

  // =========================================================
  // SUBCATEGORY
  // =========================================================

  subcategoryId: number | null = null;

  // =========================================================
  // PAGINATION
  // =========================================================

  pageNumber = 1;

  pageSize = 12;

  totalCount = 0;

  totalPages = 0;

  hasPreviousPage = false;

  hasNextPage = false;

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      // ==============================================
      // CATEGORY SLUG
      // ==============================================

      const slug = params.get('slug');

      if (slug) {
        console.log('Public News: Category slug:', slug);

        this.categorySlug = slug.trim();
      } else {
        this.categorySlug = null;
      }

      // ==============================================
      // QUERY PARAM - SUBCATEGORY
      // ==============================================

      this.route.queryParams.subscribe((queryParams) => {
        const id = Number(queryParams['subcategoryId']);

        if (id > 0) {
          console.log('Public News: Subcategory selected:', id);

          this.subcategoryId = id;
        } else {
          this.subcategoryId = null;
        }

        this.pageNumber = 1;

        this.loadNews();
      });
    });
  }

  // =========================================================
  // LOAD NEWS
  // =========================================================

  loadNews(): void {
    console.log('Public News: Loading...');

    this.isLoading = true;

    this.errorMessage = '';

    // =======================================================
    // SUBCATEGORY NEWS
    // =======================================================

    if (this.subcategoryId !== null) {
      console.log('Loading news for subcategory:', this.subcategoryId);

      this.publicNewsService.getNewsBySubcategory(this.subcategoryId).subscribe({
        next: (response: PublicNews[]) => {
          console.log('Public Subcategory News Response:', response);

          this.newsList = response ?? [];

          this.setListState();
        },

        error: (error) => {
          console.error('Public Subcategory News API Error:', error);

          this.clearNews();

          this.errorMessage = 'Unable to load news for this subcategory. Please try again later.';

          this.isLoading = false;

          this.cdr.detectChanges();
        },
      });

      return;
    }

    // =======================================================
    // CATEGORY NEWS
    // =======================================================

    if (this.categorySlug) {
      console.log('Loading category:', this.categorySlug);

      this.loadCategoryNews(this.categorySlug);

      return;
    }

    // =======================================================
    // LATEST NEWS
    // =======================================================

    console.log('Loading latest public news');

    this.publicNewsService.getLatestNews(50).subscribe({
      next: (response: PublicNews[]) => {
        console.log('Public Latest News Response:', response);

        this.newsList = response ?? [];

        this.selectedCategory = null;

        this.setListState();
      },

      error: (error) => {
        console.error('Public Latest News API Error:', error);

        this.clearNews();

        this.errorMessage = 'Unable to load latest news. Please try again later.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // =========================================================
  // LOAD CATEGORY NEWS
  // =========================================================

  private loadCategoryNews(slug: string): void {
    this.publicCategoryService.getCategoryBySlug(slug).subscribe({
      next: (category: PublicCategory) => {
        console.log('Public Category Response:', category);

        this.selectedCategory = category;

        // ==============================================
        // CATEGORY ID MIL GAYA
        // ==============================================

        this.publicNewsService.getNewsByCategory(category.id).subscribe({
          next: (response: PublicNews[]) => {
            console.log('Public Category News Response:', response);

            this.newsList = response ?? [];

            this.setListState();
          },

          error: (error) => {
            console.error('Public Category News API Error:', error);

            this.clearNews();

            this.errorMessage = 'Unable to load news for this category. Please try again later.';

            this.isLoading = false;

            this.cdr.detectChanges();
          },
        });
      },

      error: (error) => {
        console.error('Public Category API Error:', error);

        this.clearNews();

        this.errorMessage = 'Category not found.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // =========================================================
  // SET LIST STATE
  // =========================================================

  private setListState(): void {
    this.totalCount = this.newsList.length;

    this.totalPages = this.newsList.length > 0 ? 1 : 0;

    this.pageNumber = 1;

    this.hasPreviousPage = false;

    this.hasNextPage = false;

    this.isLoading = false;

    this.cdr.detectChanges();
  }

  // =========================================================
  // CLEAR NEWS
  // =========================================================

  private clearNews(): void {
    this.newsList = [];

    this.totalCount = 0;

    this.totalPages = 0;

    this.hasPreviousPage = false;

    this.hasNextPage = false;
  }

  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }

    this.pageNumber--;

    this.loadNews();
  }

  // =========================================================
  // NEXT PAGE
  // =========================================================

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }

    this.pageNumber++;

    this.loadNews();
  }

  // =========================================================
  // IMAGE URL
  // =========================================================

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

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src.includes('no-image.png')) {
      return;
    }

    image.src = 'assets/images/no-image.png';
  }

  // =========================================================
  // DATE FORMAT
  // =========================================================

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

  // =========================================================
  // TRACK BY
  // =========================================================

  trackByNewsId(index: number, news: PublicNews): number {
    return news.id;
  }
}
