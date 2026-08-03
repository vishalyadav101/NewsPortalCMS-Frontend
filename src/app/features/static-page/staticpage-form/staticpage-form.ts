import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { StaticPageService } from '../../../core/services/staticpage';
import { StaticPageRequest } from '../../../core/models/staticpage.model';

@Component({
  selector: 'app-staticpage-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './staticpage-form.html',
  styleUrl: './staticpage-form.css',
})
export class StaticpageForm implements OnInit {
  private readonly pageService = inject(StaticPageService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  page: StaticPageRequest = {
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    status: true,
  };

  pageId: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.pageId = Number(id);

      this.isEditMode = true;

      this.loadPage();
    }
  }

  loadPage(): void {
    if (this.pageId == null) return;

    this.isLoading = true;

    this.pageService.getById(this.pageId).subscribe({
      next: (data) => {
        this.page = {
          title: data.title,
          slug: data.slug,
          content: data.content,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          status: data.status,
        };

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage = 'Unable to load page.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.page.title.trim()) {
      this.errorMessage = 'Title is required.';

      return;
    }

    if (!this.page.slug.trim()) {
      this.errorMessage = 'Slug is required.';

      return;
    }

    if (!this.page.content.trim()) {
      this.errorMessage = 'Content is required.';

      return;
    }

    if (!this.page.metaTitle.trim()) {
      this.errorMessage = 'Meta Title is required.';

      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      this.pageService.update(this.pageId!, this.page).subscribe({
        next: () => {
          this.router.navigate(['/static-pages']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to update page.';
        },
      });
    } else {
      this.pageService.create(this.page).subscribe({
        next: () => {
          this.router.navigate(['/static-pages']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to save page.';
        },
      });
    }
  }
}
