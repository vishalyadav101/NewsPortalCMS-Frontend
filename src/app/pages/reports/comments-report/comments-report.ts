import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportService } from '../../../core/services/report.service';
import { CommentReport } from '../../../core/models/report.model';

@Component({
  selector: 'app-comments-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-report.html',
  styleUrl: './comments-report.css',
})
export class CommentsReport implements OnInit {
  private readonly reportService = inject(ReportService);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // COMMENTS
  // ==========================================

  comments: CommentReport[] = [];

  filteredComments: CommentReport[] = [];

  // ==========================================
  // SEARCH
  // ==========================================

  searchText = '';

  // ==========================================
  // STATES
  // ==========================================

  isLoading = true;

  errorMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadComments();
  }

  // ==========================================
  // LOAD COMMENTS REPORT
  // ==========================================

  loadComments(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.reportService.getCommentsReport().subscribe({
      next: (response) => {
        console.log('Comments Report:', response);

        this.comments = response ?? [];

        this.filteredComments = [...this.comments];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Comments Report Error:', error);

        this.errorMessage = 'Unable to load comments report.';

        this.comments = [];

        this.filteredComments = [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SEARCH
  // ==========================================

  onSearch(): void {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      this.filteredComments = [...this.comments];

      return;
    }

    this.filteredComments = this.comments.filter((comment) => {
      const userName = comment.userName?.toLowerCase() ?? '';

      const newsTitle = comment.newsTitle?.toLowerCase() ?? '';

      const commentText = comment.comment?.toLowerCase() ?? '';

      return (
        userName.includes(search) || newsTitle.includes(search) || commentText.includes(search)
      );
    });
  }

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {
    this.searchText = '';

    this.filteredComments = [...this.comments];
  }

  // ==========================================
  // REFRESH
  // ==========================================

  refresh(): void {
    this.loadComments();
  }

  // ==========================================
  // TOTAL COMMENTS
  // ==========================================

  get totalComments(): number {
    return this.comments.length;
  }
}
