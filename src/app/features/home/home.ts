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

  // ==========================================
  // DYNAMIC CATEGORY SECTIONS
  // ==========================================

  categorySections: {
    categoryName: string;
    news: News[];
  }[] = [];

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
        next: (response) => {
          console.log('Home: News API Response:', response);

          // ====================================
          // API ITEMS
          // ====================================

          const items: News[] = response?.items ?? [];

          console.log('Home: Total API News:', items.length);

          this.news = items;

          // ====================================
          // PUBLISHED NEWS
          // ====================================

          const publishedNews = items.filter((item) => item.isPublished === true);

          console.log('Home: Published News:', publishedNews.length);

          // ====================================
          // FEATURED NEWS
          // ====================================

          this.featuredNews =
            publishedNews.find((item) => item.isFeatured === true) ?? publishedNews[0] ?? null;

          console.log('Home: Featured News:', this.featuredNews);

          // ====================================
          // LATEST NEWS
          // ====================================

          this.latestNews = [...publishedNews]
            .sort((a, b) => {
              const dateA = new Date(a.publishDate).getTime();

              const dateB = new Date(b.publishDate).getTime();

              return dateB - dateA;
            })
            .slice(0, 6);

          console.log('Home: Latest News:', this.latestNews);

          // ====================================
          // TRENDING NEWS
          // ====================================

          this.trendingNews = [...publishedNews]
            .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
            .slice(0, 5);

          console.log('Home: Trending News:', this.trendingNews);

          // ====================================
          // DYNAMIC CATEGORY SECTIONS
          // ====================================

          const categoryMap = new Map<string, News[]>();

          for (const item of publishedNews) {
            const categoryName = item.categoryName?.trim();

            if (!categoryName) {
              continue;
            }

            if (!categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, []);
            }

            categoryMap.get(categoryName)!.push(item);
          }

          // ====================================
          // CREATE CATEGORY SECTIONS
          // ====================================

          this.categorySections = Array.from(categoryMap.entries())
            .map(([categoryName, categoryNews]) => ({
              categoryName,
              news: [...categoryNews]
                .sort((a, b) => {
                  const dateA = new Date(a.publishDate).getTime();

                  const dateB = new Date(b.publishDate).getTime();

                  return dateB - dateA;
                })
                .slice(0, 4),
            }))
            .filter((section) => section.news.length > 0);

          console.log('Home: Category Sections:', this.categorySections);

          // ====================================
          // CLEAR ERROR
          // ====================================

          this.errorMessage = '';

          // ====================================
          // LOADING COMPLETE
          // ====================================

          this.isLoading = false;

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

          this.categorySections = [];

          this.errorMessage = 'Unable to load latest news. Please try again later.';

          this.isLoading = false;

          this.cdr.detectChanges();

          console.log('Home: Loading failed.');
        },
      });
  }

  // ==========================================
  // IMAGE URL
  // ==========================================

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath || imagePath.trim() === '') {
      return 'assets/images/news-placeholder.jpg';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    return `${this.apiBaseUrl}/${cleanPath}`;
  }

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

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
  // TRACK BY NEWS ID
  // ==========================================

  trackByNewsId(index: number, news: News): number {
    return news.id;
  }

  // ==========================================
  // TRACK BY CATEGORY
  // ==========================================

  trackByCategory(
    index: number,
    section: {
      categoryName: string;
      news: News[];
    },
  ): string {
    return section.categoryName;
  }
}
