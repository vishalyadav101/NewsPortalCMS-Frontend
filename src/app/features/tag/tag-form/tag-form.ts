import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TagService } from '../../../core/services/tag';
import { TagRequest } from '../../../core/models/tag.model';

@Component({
  selector: 'app-tag-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tag-form.html',
  styleUrl: './tag-form.css',
})
export class TagForm implements OnInit {
  private readonly tagService = inject(TagService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  tag: TagRequest = {
    name: '',
    slug: '',
    isActive: true,
  };

  tagId: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.tagId = Number(id);
      this.isEditMode = true;
      this.loadTag();
    }
  }

  private loadTag(): void {
    if (this.tagId === null) {
      return;
    }

    this.isLoading = true;

    this.tagService.getById(this.tagId).subscribe({
      next: (data) => {
        this.tag = {
          name: data.name,
          slug: data.slug,
          isActive: data.isActive,
        };

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Tag GET error:', error);

        this.errorMessage = 'Unable to load tag.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.tag.name.trim()) {
      this.errorMessage = 'Tag name is required.';
      return;
    }

    if (!this.tag.slug.trim()) {
      this.errorMessage = 'Slug is required.';
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.tagId !== null) {
      this.updateTag();
    } else {
      this.createTag();
    }
  }

  private createTag(): void {
    this.tagService.create(this.tag).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/tags']);
      },

      error: (error) => {
        console.error('Create Tag error:', error);
        this.handleError(error);
      },
    });
  }

  private updateTag(): void {
    if (this.tagId === null) {
      return;
    }

    this.tagService.update(this.tagId, this.tag).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/tags']);
      },

      error: (error) => {
        console.error('Update Tag error:', error);
        this.handleError(error);
      },
    });
  }

  private handleError(error: any): void {
    this.isSaving = false;

    this.errorMessage = error.error?.message || 'Unable to save tag.';

    this.cdr.detectChanges();
  }
}
