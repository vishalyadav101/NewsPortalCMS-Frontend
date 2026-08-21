import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsService } from '../../core/services/news';
import { News } from '../../core/models/news.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly newsService = inject(NewsService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly apiBaseUrl = 'https://localhost:7103';

  // ==========================================
  // STATE
  // ==========================================

  news: News[] = [];

  featuredNews: News | null = null;

  latestNews: News[] = [];

  trendingNews: News[] = [];

  isLoading = true;

  errorMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadNews();
  }

  // ==========================================
  // LOAD NEWS
  // ==========================================

  loadNews(): void {
    console.log('Home: Loading news...');

    this.isLoading = true;

    this.errorMessage = '';

    this.newsService
      .getAllPaged('', undefined, true, undefined, 'publishDate_desc', 1, 100)
      .subscribe({
        // ======================================
        // SUCCESS
        // ======================================

        next: (response) => {
          console.log('Home: News API Response:', response);

          // ====================================
          // API ITEMS
          // ====================================

          const items: News[] = response?.items ?? [];

          console.log('Home: Total API News:', items.length);

          // ====================================
          // SAVE ALL NEWS
          // ====================================

          this.news = items;

          // ====================================
          // PUBLISHED NEWS
          // ====================================

          const publishedNews = items.filter((item) => item.isPublished === true);

          console.log('Home: Published News:', publishedNews.length);

          // ====================================
          // FEATURED NEWS
          // ====================================

          const featured =
            publishedNews.find((item) => item.isFeatured === true) ?? publishedNews[0] ?? null;

          this.featuredNews = featured;

          console.log('Home: Featured News:', this.featuredNews);

          // ====================================
          // LATEST NEWS
          // ====================================

          const latest = [...publishedNews]
            .sort((a, b) => {
              const dateA = new Date(a.publishDate).getTime();

              const dateB = new Date(b.publishDate).getTime();

              return dateB - dateA;
            })
            .slice(0, 6);

          this.latestNews = latest;

          console.log('Home: Latest News:', this.latestNews);

          // ====================================
          // TRENDING NEWS
          // ====================================

          const trending = [...publishedNews]
            .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
            .slice(0, 5);

          this.trendingNews = trending;

          console.log('Home: Trending News:', this.trendingNews);

          // ====================================
          // CLEAR ERROR
          // ====================================

          this.errorMessage = '';

          // ====================================
          // LOADING COMPLETE
          // ====================================

          this.isLoading = false;

          // ====================================
          // FORCE VIEW UPDATE
          // ====================================

          this.cdr.detectChanges();

          console.log('Home: Loading completed.');
        },

        // ======================================
        // ERROR
        // ======================================

        error: (error) => {
          console.error('Home: Failed to load news:', error);

          this.news = [];

          this.featuredNews = null;

          this.latestNews = [];

          this.trendingNews = [];

          this.errorMessage = 'Unable to load latest news. Please try again later.';

          this.isLoading = false;

          // ====================================
          // FORCE ERROR VIEW UPDATE
          // ====================================

          this.cdr.detectChanges();

          console.log('Home: Loading failed.');
        },
      });
  }

  // ==========================================
  // IMAGE URL
  // ==========================================

  getImageUrl(imagePath: string | null | undefined): string {
    // ----------------------------------------
    // NO IMAGE
    // ----------------------------------------

    if (!imagePath || imagePath.trim() === '') {
      return 'assets/images/news-placeholder.jpg';
    }

    // ----------------------------------------
    // FULL URL
    // ----------------------------------------

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // ----------------------------------------
    // CLEAN PATH
    // ----------------------------------------

    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    // ----------------------------------------
    // FINAL IMAGE URL
    // ----------------------------------------

    return `${this.apiBaseUrl}/${cleanPath}`;
  }

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    // Prevent infinite error loop
    if (image.src.includes('news-placeholder.jpg')) {
      return;
    }

    image.src = 'assets/images/news-placeholder.jpg';
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
