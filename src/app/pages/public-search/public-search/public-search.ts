import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PublicNews } from '../../../core/models/public-news.model';
import { PublicNewsService } from '../../../core/services/public-news';

@Component({
  selector: 'app-public-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-search.html',
  styleUrl: './public-search.css',
})
export class PublicSearch implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly publicNewsService = inject(PublicNewsService);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // SEARCH KEYWORD
  // ==========================================

  searchKeyword = '';

  // ==========================================
  // SEARCH RESULTS
  // ==========================================

  newsList: PublicNews[] = [];

  // ==========================================
  // STATE
  // ==========================================

  isLoading = false;

  errorMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const keyword = (params['keyword'] || '').trim();

      this.searchKeyword = keyword;

      // ----------------------------------------
      // EMPTY SEARCH
      // ----------------------------------------

      if (!keyword) {
        this.newsList = [];

        this.isLoading = false;

        this.errorMessage = '';

        this.cdr.detectChanges();

        return;
      }

      // ----------------------------------------
      // SEARCH
      // ----------------------------------------

      this.searchNews(keyword);
    });
  }

  // ==========================================
  // SEARCH NEWS
  // ==========================================

  private searchNews(keyword: string): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.newsList = [];

    this.publicNewsService.searchNews(keyword).subscribe({
      next: (response: PublicNews[]) => {
        console.log(`Search results for "${keyword}":`, response);

        this.newsList = response;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Search error:', error);

        this.newsList = [];

        this.errorMessage = 'Unable to search news.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }
}
