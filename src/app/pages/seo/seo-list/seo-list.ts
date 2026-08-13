import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Seo } from '../../../core/models/seo.model';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-seo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seo-list.html',
  styleUrl: './seo-list.css',
})
export class SeoList implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  seoList: Seo[] = [];

  isLoading = false;
  errorMessage = '';

  searchText = '';

  ngOnInit(): void {
    this.loadSeo();
  }

  loadSeo(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.seoService.getAll().subscribe({
      next: (response) => {
        this.seoList = response;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('SEO loading error:', error);

        this.errorMessage = 'Unable to load SEO settings.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  get filteredSeo(): Seo[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.seoList;
    }

    return this.seoList.filter(
      (item) =>
        item.pageName.toLowerCase().includes(search) ||
        item.metaTitle.toLowerCase().includes(search),
    );
  }

  addSeo(): void {
    this.router.navigate(['/seo/add']);
  }

  editSeo(id: number): void {
    this.router.navigate(['/seo/edit', id]);
  }

  deleteSeo(item: Seo): void {
    const confirmed = confirm(
      `Are you sure you want to delete SEO settings for "${item.pageName}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.seoService.delete(item.id).subscribe({
      next: () => {
        this.seoList = this.seoList.filter((x) => x.id !== item.id);
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('SEO delete error:', error);
        alert('Unable to delete SEO settings.');
      },
    });
  }
}
