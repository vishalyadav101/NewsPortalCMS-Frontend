import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { NewsService } from '../../../core/services/news';
import { News } from '../../../core/models/news.model';

@Component({
  selector: 'app-news-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
})
export class NewsList implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly cdr = inject(ChangeDetectorRef);

  newsList: News[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.newsService.getAll().subscribe({
      next: (data) => {
        this.newsList = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('News GET error:', error);

        this.errorMessage = 'Unable to load news.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteNews(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this news?');

    if (!confirmed) {
      return;
    }

    this.newsService.delete(id).subscribe({
      next: () => {
        this.loadNews();
      },

      error: (error) => {
        console.error('Delete News error:', error);
        alert('Unable to delete news.');
      },
    });
  }
}
