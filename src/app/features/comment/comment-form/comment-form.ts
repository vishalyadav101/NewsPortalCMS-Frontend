import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  Comment,
  CommentRequest,
  UpdateCommentRequest,
} from '../../../core/models/comment.model';

import { CommentService } from '../../../core/services/comment.service';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css',
})
export class CommentForm implements OnInit {
  private readonly commentService = inject(CommentService);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  commentId = '';

  isEditMode = false;
  isLoading = true;
  isSaving = false;

  errorMessage = '';

  comment: CommentRequest = {
    newsId: 0,
    userId: '',
    name: '',
    email: '',
    content: '',
  };

  isApproved = false;
  isActive = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.commentId = id;
      this.isEditMode = true;
      this.loadComment();
    } else {
      this.isLoading = false;
    }
  }

  loadComment(): void {
    this.commentService.getById(this.commentId).subscribe({
      next: (data: Comment) => {
        this.comment = {
          newsId: data.newsId,
          userId: data.userId ?? '',
          name: data.name,
          email: data.email,
          content: data.content,
        };

        this.isApproved = data.isApproved;
        this.isActive = data.isActive;

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error(error);

        this.errorMessage = 'Unable to load comment.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }
    save(): void {
    this.errorMessage = '';

    if (!this.comment.newsId) {
      this.errorMessage = 'News Id is required.';
      return;
    }

    if (!this.comment.name.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }

    if (!this.comment.email.trim()) {
      this.errorMessage = 'Email is required.';
      return;
    }

    if (!this.comment.content.trim()) {
      this.errorMessage = 'Comment is required.';
      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      const request: UpdateCommentRequest = {
        name: this.comment.name,
        email: this.comment.email,
        content: this.comment.content,
        isApproved: this.isApproved,
        isActive: this.isActive,
      };

      this.updateComment(request);
    } else {
      this.createComment(this.comment);
    }
  }

  private createComment(request: CommentRequest): void {
    this.commentService.create(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/comments']);
      },

      error: (error: any) => {
        console.error(error);

        this.isSaving = false;
        this.errorMessage =
          error.error?.message || 'Unable to create comment.';

        this.cdr.detectChanges();
      },
    });
  }

  private updateComment(request: UpdateCommentRequest): void {
    this.commentService.update(this.commentId, request).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/comments']);
      },

      error: (error: any) => {
        console.error(error);

        this.isSaving = false;
        this.errorMessage =
          error.error?.message || 'Unable to update comment.';

        this.cdr.detectChanges();
      },
    });
  }
}