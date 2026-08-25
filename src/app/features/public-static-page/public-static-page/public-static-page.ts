import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { StaticPageService } from '../../../core/services/staticpage';
import { StaticPage } from '../../../core/models/staticpage.model';

@Component({
  selector: 'app-public-static-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-static-page.html',
  styleUrl: './public-static-page.css',
})
export class PublicStaticPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly staticPageService = inject(StaticPageService);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // CURRENT PAGE
  // ==========================================

  page: StaticPage | null = null;

  // ==========================================
  // STATE
  // ==========================================

  isLoading = true;

  errorMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) {
        this.page = null;
        this.errorMessage = 'Page not found.';
        this.isLoading = false;

        this.cdr.detectChanges();

        return;
      }

      this.loadPage(slug);
    });
  }

  // ==========================================
  // LOAD STATIC PAGE
  // ==========================================

  private loadPage(slug: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.page = null;

    this.staticPageService.getAll().subscribe({
      next: (pages: StaticPage[]) => {
        const page = pages.find(
          (item: StaticPage) => item.slug?.trim().toLowerCase() === slug.trim().toLowerCase(),
        );

        // ======================================
        // PAGE NOT FOUND
        // ======================================

        if (!page) {
          this.page = null;

          this.errorMessage = 'The requested page could not be found.';

          this.isLoading = false;

          this.cdr.detectChanges();

          return;
        }

        // ======================================
        // PAGE INACTIVE
        // ======================================

        if (!page.status) {
          this.page = null;

          this.errorMessage = 'This page is currently unavailable.';

          this.isLoading = false;

          this.cdr.detectChanges();

          return;
        }

        // ======================================
        // PAGE FOUND
        // ======================================

        this.page = page;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Static Page API Error:', error);

        this.page = null;

        this.errorMessage = 'Unable to load this page. Please try again later.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }
}
