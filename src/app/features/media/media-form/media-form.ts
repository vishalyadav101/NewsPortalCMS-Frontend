import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MediaService } from '../../../core/services/media';
import { MediaRequest } from '../../../core/models/media.model';

@Component({
  selector: 'app-media-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './media-form.html',
  styleUrl: './media-form.css',
})
export class MediaForm implements OnInit {
  private readonly mediaService = inject(MediaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  media: MediaRequest = {
    fileName: '',
    originalFileName: '',
    filePath: '',
    fileType: '',
    contentType: '',
    fileSize: 0,
    uploadedBy: '',
    isActive: true,
  };

  mediaId: number | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.mediaId = Number(id);
      this.isEditMode = true;
      this.loadMedia();
    }
  }

  private loadMedia(): void {
    if (this.mediaId === null) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.mediaService.getById(this.mediaId).subscribe({
      next: (data) => {
        this.media = {
          fileName: data.fileName,
          originalFileName: data.originalFileName,
          filePath: data.filePath,
          fileType: data.fileType,
          contentType: data.contentType,
          fileSize: data.fileSize,
          uploadedBy: data.uploadedBy,
          isActive: data.isActive,
        };

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Media GET error:', error);

        this.errorMessage = 'Unable to load media.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.media.fileName.trim()) {
      this.errorMessage = 'File name is required.';
      return;
    }

    if (!this.media.originalFileName.trim()) {
      this.errorMessage = 'Original file name is required.';
      return;
    }

    if (!this.media.filePath.trim()) {
      this.errorMessage = 'File path is required.';
      return;
    }

    if (!this.media.fileType.trim()) {
      this.errorMessage = 'File type is required.';
      return;
    }

    if (!this.media.contentType.trim()) {
      this.errorMessage = 'Content type is required.';
      return;
    }

    if (this.media.fileSize < 0) {
      this.errorMessage = 'File size cannot be negative.';
      return;
    }

    if (!this.media.uploadedBy.trim()) {
      this.errorMessage = 'Uploaded by is required.';
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.mediaId !== null) {
      this.updateMedia();
    } else {
      this.createMedia();
    }
  }

  private createMedia(): void {
    this.mediaService.create(this.media).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/media']);
      },

      error: (error) => {
        console.error('Create Media error:', error);
        this.handleError(error);
      },
    });
  }

  private updateMedia(): void {
    if (this.mediaId === null) {
      return;
    }

    this.mediaService.update(this.mediaId, this.media).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/media']);
      },

      error: (error) => {
        console.error('Update Media error:', error);
        this.handleError(error);
      },
    });
  }

  private handleError(error: any): void {
    this.isSaving = false;

    this.errorMessage = error.error?.message || 'Unable to save media.';

    this.cdr.detectChanges();
  }
}
