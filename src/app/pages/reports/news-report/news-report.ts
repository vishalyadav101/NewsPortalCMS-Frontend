import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportService } from '../../../core/services/report.service';
import { NewsReport } from '../../../core/models/report.model';

@Component({
  selector: 'app-news-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-report.html',
  styleUrl: './news-report.css',
})
export class NewsReportComponent implements OnInit {
  private readonly reportService = inject(ReportService);

  news: NewsReport[] = [];
  filteredNews: NewsReport[] = [];

  searchTerm = '';
  statusFilter = 'all';

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadNewsReport();
  }

  loadNewsReport(): void {
    this.loading = true;
    this.errorMessage = '';

    this.reportService.getNewsReport().subscribe({
      next: (response) => {
        this.news = response;
        this.filteredNews = response;

        this.loading = false;
      },

      error: (error) => {
        console.error('News Report API Error:', error);

        this.errorMessage = 'Unable to load news report. Please try again.';

        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const search = this.searchTerm.trim().toLowerCase();

    this.filteredNews = this.news.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.categoryName.toLowerCase().includes(search) ||
        item.authorName.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'published' && item.isPublished) ||
        (this.statusFilter === 'unpublished' && !item.isPublished);

      return matchesSearch && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';

    this.filteredNews = [...this.news];
  }

  get publishedCount(): number {
    return this.news.filter((x) => x.isPublished).length;
  }

  get unpublishedCount(): number {
    return this.news.filter((x) => !x.isPublished).length;
  }
}
