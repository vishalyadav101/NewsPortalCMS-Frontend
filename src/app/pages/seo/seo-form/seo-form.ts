import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SeoRequest } from '../../../core/models/seo.model';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-seo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seo-form.html',
  styleUrl: './seo-form.css',
})
export class SeoForm implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  seo: SeoRequest = {
    pageName: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    robots: 'index, follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    schemaMarkup: '',
    isActive: true,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id = Number(id);

      this.isEditMode = true;

      this.loadSeo(this.id);
    }
  }

  loadSeo(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.seoService.getById(id).subscribe({
      next: (response) => {
        this.seo = {
          pageName: response.pageName,
          metaTitle: response.metaTitle,
          metaDescription: response.metaDescription,
          metaKeywords: response.metaKeywords,
          canonicalUrl: response.canonicalUrl,
          robots: response.robots,
          ogTitle: response.ogTitle,
          ogDescription: response.ogDescription,
          ogImage: response.ogImage,
          twitterTitle: response.twitterTitle,
          twitterDescription: response.twitterDescription,
          twitterImage: response.twitterImage,
          schemaMarkup: response.schemaMarkup,
          isActive: response.isActive,
        };

        this.isLoading = false;
      },

      error: (error) => {
        console.error('SEO load error:', error);

        this.errorMessage = 'Unable to load SEO settings.';

        this.isLoading = false;
      },
    });
  }

  save(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.seo.pageName.trim()) {
      this.errorMessage = 'Page name is required.';

      return;
    }

    if (!this.seo.metaTitle.trim()) {
      this.errorMessage = 'Meta title is required.';

      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.id !== null) {
      this.seoService.update(this.seo).subscribe({
        next: () => {
          this.successMessage = 'SEO settings updated successfully.';

          this.isSaving = false;

          setTimeout(() => {
            this.router.navigate(['/seo']);
          }, 800);
        },

        error: (error) => {
          console.error('SEO update error:', error);

          this.errorMessage = 'Unable to update SEO settings.';

          this.isSaving = false;
        },
      });
    } else {
      this.seoService.create(this.seo).subscribe({
        next: () => {
          this.successMessage = 'SEO settings created successfully.';

          this.isSaving = false;

          setTimeout(() => {
            this.router.navigate(['/seo']);
          }, 800);
        },

        error: (error) => {
          console.error('SEO create error:', error);

          this.errorMessage = 'Unable to create SEO settings.';

          this.isSaving = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/seo']);
  }
}
