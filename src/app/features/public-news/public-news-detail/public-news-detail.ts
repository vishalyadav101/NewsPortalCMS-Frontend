import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NewsService } from '../../../core/services/news';
import { News } from '../../../core/models/news.model';

import { PublicComments } from '../public-comments/public-comments';

@Component({
  selector: 'app-public-news-detail',
  standalone: true,

  imports: [CommonModule, RouterLink, PublicComments],

  templateUrl: './public-news-detail.html',
  styleUrl: './public-news-detail.css',
})
export class PublicNewsDetail implements OnInit {
  private readonly newsService = inject(NewsService);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // CURRENT NEWS
  // ==========================================

  news: News | null = null;

  // ==========================================
  // RELATED NEWS
  // ==========================================

  relatedNews: News[] = [];

  // ==========================================
  // STATE
  // ==========================================

  isLoading = true;

  errorMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadNews();
  }

  // ==========================================
  // LOAD NEWS BY ID
  // ==========================================

  loadNews(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.relatedNews = [];

    const idParam = this.route.snapshot.paramMap.get('id');

    const id = Number(idParam);

    // ========================================
    // VALIDATE ID
    // ========================================

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.news = null;

      this.errorMessage = 'Invalid news article.';

      this.isLoading = false;

      return;
    }

    console.log('Public News Detail ID:', id);

    // ========================================
    // GET NEWS
    // ========================================

    this.newsService.getById(id).subscribe({
      // ====================================
      // SUCCESS
      // ====================================

      next: (response: News) => {
        console.log('Public News Detail Response:', response);

        this.news = response;

        this.isLoading = false;

        // Load related news

        this.loadRelatedNews(response);

        this.cdr.detectChanges();
      },

      // ====================================
      // ERROR
      // ====================================

      error: (error: unknown) => {
        console.error('Public News Detail API Error:', error);

        this.news = null;

        this.relatedNews = [];

        this.errorMessage = 'Unable to load this news article.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // LOAD RELATED NEWS
  // ==========================================

  private loadRelatedNews(currentNews: News): void {
    // ----------------------------------------
    // CATEGORY CHECK
    // ----------------------------------------

    if (!currentNews.categoryId) {
      this.relatedNews = [];

      return;
    }

    console.log('Loading related news for category:', currentNews.categoryId);

    // ----------------------------------------
    // GET SAME CATEGORY NEWS
    // ----------------------------------------

    this.newsService
      .getAllPaged('', currentNews.categoryId, true, undefined, 'publishDate_desc', 1, 10)
      .subscribe({
        // ====================================
        // SUCCESS
        // ====================================

        next: (response) => {
          const items: News[] = response?.items ?? [];

          // Current article ko remove karo

          this.relatedNews = items.filter((item) => item.id !== currentNews.id).slice(0, 4);

          console.log('Related News:', this.relatedNews);

          this.cdr.detectChanges();
        },

        // ====================================
        // ERROR
        // ====================================

        error: (error: unknown) => {
          console.error('Related News API Error:', error);

          this.relatedNews = [];

          this.cdr.detectChanges();
        },
      });
  }

  // ==========================================
  // IMAGE URL
  // ==========================================

  getImageUrl(imagePath: string | null): string {
    if (!imagePath || !imagePath.trim()) {
      return 'assets/images/no-image.png';
    }

    // Full URL

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Clean path

    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `https://localhost:7103${cleanPath}`;
  }

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    // Prevent infinite loop

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

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  // ==========================================
  // VIDEO URL
  // ==========================================

  getVideoUrl(videoPath: string | null): string {
    if (!videoPath) {
      return '';
    }

    // Full URL

    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
      return videoPath;
    }

    // Clean path

    const cleanPath = videoPath.startsWith('/') ? videoPath : `/${videoPath}`;

    return `https://localhost:7103${cleanPath}`;
  }
}
