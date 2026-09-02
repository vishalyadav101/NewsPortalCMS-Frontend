import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WebsiteSettingService } from '../../core/services/website-setting';
import { WebsiteSetting } from '../../core/models/website-setting.model';

import { PublicNewsService } from '../../core/services/public-news';

import { PublicCategoryService, PublicCategory } from '../../core/services/public-category';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './public-header.html',
  styleUrl: './public-header.css',
})
export class PublicHeader implements OnInit {
  private readonly websiteSettingService = inject(WebsiteSettingService);

  private readonly publicNewsService = inject(PublicNewsService);

  private readonly publicCategoryService = inject(PublicCategoryService);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // CURRENT DATE
  // ==========================================

  readonly currentDate = new Date();

  // ==========================================
  // WEBSITE SETTINGS
  // ==========================================

  settings: WebsiteSetting | null = null;

  isLoadingSettings = true;

  // ==========================================
  // CATEGORIES
  // ==========================================

  categories: PublicCategory[] = [];

  isLoadingCategories = true;

  // ==========================================
  // SEARCH
  // ==========================================

  searchKeyword = '';

  // ==========================================
  // FORMATTED DATE
  // ==========================================

  get formattedDate(): string {
    return this.currentDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadWebsiteSettings();

    this.loadCategories();
  }

  // ==========================================
  // LOAD WEBSITE SETTINGS
  // ==========================================

  private loadWebsiteSettings(): void {
    this.websiteSettingService.getSettings().subscribe({
      next: (data) => {
        this.settings = data;

        this.isLoadingSettings = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Public Header Settings Error:', error);

        this.settings = null;

        this.isLoadingSettings = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // LOAD PUBLIC CATEGORIES
  // ==========================================

  private loadCategories(): void {
    this.publicCategoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.slice().sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }

          return a.name.localeCompare(b.name);
        });

        this.isLoadingCategories = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Public Categories Error:', error);

        this.categories = [];

        this.isLoadingCategories = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SEARCH NEWS
  // ==========================================

  searchNews(): void {
    const keyword = this.searchKeyword.trim();

    if (!keyword) {
      return;
    }

    this.router.navigate(['/public/search'], {
      queryParams: {
        keyword,
      },
    });
  }

  // ==========================================
  // SOCIAL MEDIA URL
  // ==========================================

  getSocialUrl(url: string | null | undefined): string {
    return url?.trim() || '';
  }
}
