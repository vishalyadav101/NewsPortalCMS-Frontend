import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StaticPageService } from '../../../core/services/staticpage';
import { StaticPage } from '../../../core/models/staticpage.model';

@Component({
  selector: 'app-staticpage-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './staticpage-list.html',
  styleUrl: './staticpage-list.css',
})
export class StaticpageList implements OnInit {
  private readonly staticPageService = inject(StaticPageService);

  private readonly cdr = inject(ChangeDetectorRef);

  pages: StaticPage[] = [];

  isLoading = true;

  errorMessage = '';

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.staticPageService.getAll().subscribe({
      next: (data) => {
        this.pages = data;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load static pages.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deletePage(id: number): void {
    const confirmed = confirm('Delete this page?');

    if (!confirmed) {
      return;
    }

    this.staticPageService.delete(id).subscribe({
      next: () => {
        this.pages = this.pages.filter((x) => x.id !== id);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        alert(error.error?.message ?? 'Unable to delete page.');
      },
    });
  }
}
