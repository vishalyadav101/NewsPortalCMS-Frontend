import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CommentService } from '../../../core/services/comment.service';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css',
})
export class CommentList implements OnInit {
  private readonly commentService = inject(CommentService);
  private readonly cdr = inject(ChangeDetectorRef);

  comments: Comment[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.commentService.getAll().subscribe({
      next: (response) => {
        this.comments = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load comments.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteComment(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this comment?');

    if (!confirmed) {
      return;
    }

    this.commentService.delete(id).subscribe({
      next: () => {
        this.comments = this.comments.filter((x) => x.id !== id);
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);
        alert(error.error?.message || 'Unable to delete comment.');
      },
    });
  }
}
