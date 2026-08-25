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
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-public-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-comments.html',
  styleUrl: './public-comments.css',
})
export class PublicComments implements OnChanges {
  private readonly commentService = inject(CommentService);
  private readonly auth = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // NEWS ID
  // ==========================================

  @Input() newsId!: number;

  // ==========================================
  // CURRENT USER
  // ==========================================

  currentUserName = 'User';

  currentUserEmail = '';

  currentUserId: string | null = null;

  // ==========================================
  // COMMENTS
  // ==========================================

  comments: Comment[] = [];

  // ==========================================
  // ONLY APPROVED + ACTIVE COMMENTS
  // ==========================================

  get visibleComments(): Comment[] {
    return this.comments.filter(
      (comment) => comment.isActive === true && comment.isApproved === true,
    );
  }

  // ==========================================
  // STATE
  // ==========================================

  isLoading = true;

  isSubmitting = false;

  errorMessage = '';

  successMessage = '';

  // ==========================================
  // COMMENT FORM
  // ==========================================

  commentForm: CommentRequest = {
    newsId: 0,
    userId: null,
    name: '',
    email: '',
    content: '',
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newsId'] && this.newsId) {
      this.loadCurrentUser();

      this.commentForm.newsId = this.newsId;

      this.loadComments();
    }
  }

  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  private loadCurrentUser(): void {
    const user = this.auth.getCurrentUser();

    if (!user) {
      this.currentUserName = 'User';

      this.currentUserEmail = '';

      this.currentUserId = null;

      this.commentForm.userId = null;

      this.commentForm.name = '';

      this.commentForm.email = '';

      return;
    }

    this.currentUserName = user.name || user.userName || 'User';

    this.currentUserEmail = user.email || '';

    this.currentUserId = user.userId || null;

    // Set user information
    this.commentForm.userId = this.currentUserId;

    this.commentForm.name = this.currentUserName;

    this.commentForm.email = this.currentUserEmail;

    console.log('Current Comment User:', {
      userId: this.currentUserId,
      name: this.currentUserName,
      email: this.currentUserEmail,
    });
  }

  // ==========================================
  // LOAD COMMENTS
  // ==========================================

  loadComments(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.commentService.getByNewsId(this.newsId).subscribe({
      next: (response: Comment[]) => {
        this.comments = response ?? [];

        this.isLoading = false;

        console.log('All Comments:', this.comments);

        console.log('Visible Comments:', this.visibleComments);

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
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

    // ========================================
    // CHECK LOGIN
    // ========================================

    if (!this.auth.isLoggedIn()) {
      this.errorMessage = 'Please login before posting a comment.';

      return;
    }

    // ========================================
    // GET CURRENT USER AGAIN
    // ========================================

    this.loadCurrentUser();

    // ========================================
    // VALIDATE USER
    // ========================================

    if (!this.currentUserName.trim()) {
      this.errorMessage = 'Unable to identify the logged-in user.';

      return;
    }

    if (!this.currentUserEmail.trim()) {
      this.errorMessage = 'Your email is not available in the login session.';

      return;
    }

    // ========================================
    // VALIDATE COMMENT
    // ========================================

    if (!this.commentForm.content.trim()) {
      this.errorMessage = 'Please write a comment.';

      return;
    }

    // ========================================
    // FINAL REQUEST
    // ========================================

    const request: CommentRequest = {
      newsId: this.newsId,

      userId: this.currentUserId,

      name: this.currentUserName,

      email: this.currentUserEmail,

      content: this.commentForm.content.trim(),
    };

    console.log('Comment POST Request:', request);

    // ========================================
    // SUBMIT START
    // ========================================

    this.isSubmitting = true;

    // ========================================
    // CREATE COMMENT
    // ========================================

    this.commentService.create(request).subscribe({
      next: (response: Comment) => {
        console.log('Comment created:', response);

        this.isSubmitting = false;

        this.successMessage = 'Comment posted successfully.';

        // Clear only comment text
        this.commentForm.content = '';

        // Reload comments
        this.loadComments();

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Comment POST error:', error);

        this.isSubmitting = false;

        const apiError = error as {
          error?: {
            message?: string;
          };
        };

        this.errorMessage =
          apiError.error?.message || 'Unable to submit comment. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // DATE FORMAT
  // ==========================================

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
