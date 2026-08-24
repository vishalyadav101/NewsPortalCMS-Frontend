import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Comment, CommentRequest } from '../../../core/models/comment.model';
import { CommentService } from '../../../core/services/comment.service';

@Component({
  selector: 'app-public-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-comments.html',
  styleUrl: './public-comments.css',
})
export class PublicComments implements OnChanges {
  private readonly commentService = inject(CommentService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() newsId!: number;

  comments: Comment[] = [];

  isLoading = true;
  isSubmitting = false;

  errorMessage = '';
  successMessage = '';

  commentForm: CommentRequest = {
    newsId: 0,
    userId: null,
    name: '',
    email: '',
    content: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newsId'] && this.newsId) {
      this.commentForm.newsId = this.newsId;
      this.loadComments();
    }
  }

  // ==========================================
  // LOAD COMMENTS
  // ==========================================

  loadComments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.commentService.getByNewsId(this.newsId).subscribe({
      next: (response) => {
        this.comments = response ?? [];
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('Comments GET error:', error);

        this.comments = [];
        this.errorMessage = 'Unable to load comments.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SUBMIT COMMENT
  // ==========================================

  submitComment(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.commentForm.name.trim()) {
      this.errorMessage = 'Please enter your name.';
      return;
    }

    if (!this.commentForm.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    if (!this.commentForm.content.trim()) {
      this.errorMessage = 'Please write a comment.';
      return;
    }

    this.commentForm.newsId = this.newsId;

    this.isSubmitting = true;

    this.commentService.create(this.commentForm).subscribe({
      next: (response) => {
        console.log('Comment created:', response);

        this.isSubmitting = false;

        this.successMessage = 'Comment submitted successfully.';

        this.commentForm.name = '';
        this.commentForm.email = '';
        this.commentForm.content = '';

        this.loadComments();

        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('Comment POST error:', error);

        this.isSubmitting = false;

        this.errorMessage = error.error?.message || 'Unable to submit comment. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // DATE
  // ==========================================

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
