import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { RouterLink } from '@angular/router';

import { WebsiteSettingService } from '../../core/services/website-setting';
import { WebsiteSetting } from '../../core/models/website-setting.model';

import { PublicCategoryService, PublicCategory } from '../../core/services/public-category';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-footer.html',
  styleUrl: './public-footer.css',
})
export class PublicFooter implements OnInit {
  // ==========================================
  // SERVICES
  // ==========================================

  private readonly websiteSettingService = inject(WebsiteSettingService);

  private readonly publicCategoryService = inject(PublicCategoryService);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // CURRENT YEAR
  // ==========================================

  currentYear = new Date().getFullYear();

  // ==========================================
  // WEBSITE SETTINGS
  // ==========================================

  settings: WebsiteSetting | null = null;

  // ==========================================
  // CATEGORIES
  // ==========================================

  categories: PublicCategory[] = [];

  isLoadingCategories = true;
  showAllCategories = false;
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

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Website settings error:', error);
      },
    });
  }

  // ==========================================
  // LOAD PUBLIC CATEGORIES
  // ==========================================

  private loadCategories(): void {
    this.publicCategoryService.getCategories().subscribe({
      next: (categories: PublicCategory[]) => {
        console.log('FOOTER PUBLIC CATEGORIES:', categories);

        this.categories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

        this.isLoadingCategories = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Footer category API error:', error);

        this.categories = [];

        this.isLoadingCategories = false;

        this.cdr.detectChanges();
      },
    });
  }
  // ==========================================
  // SHOW / HIDE ALL CATEGORIES
  // ==========================================

  toggleCategories(): void {
    this.showAllCategories = !this.showAllCategories;
  }
  // ==========================================
  // SOCIAL URL
  // ==========================================

  getSocialUrl(url: string | null | undefined): string {
    return url?.trim() || '';
  }
}
