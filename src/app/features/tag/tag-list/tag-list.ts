import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TagService } from '../../../core/services/tag';
import { Tag } from '../../../core/models/tag.model';

@Component({
  selector: 'app-tag-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.css',
})
export class TagList implements OnInit {
  private readonly tagService = inject(TagService);
  private readonly cdr = inject(ChangeDetectorRef);

  tags: Tag[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tagService.getAll().subscribe({
      next: (data) => {
        this.tags = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Tag GET error:', error);

        this.errorMessage = 'Unable to load tags.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteTag(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this tag?');

    if (!confirmed) {
      return;
    }

    this.tagService.delete(id).subscribe({
      next: () => {
        this.tags = this.tags.filter((tag) => tag.id !== id);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Delete Tag error:', error);
        alert(error.error?.message || 'Unable to delete tag.');
      },
    });
  }
}
