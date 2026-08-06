import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MediaService } from '../../../core/services/media';
import { Media } from '../../../core/models/media.model';

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './media-list.html',
  styleUrl: './media-list.css',
})
export class MediaList implements OnInit {
  private readonly mediaService = inject(MediaService);
  private readonly cdr = inject(ChangeDetectorRef);

  mediaList: Media[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.mediaService.getAll().subscribe({
      next: (data) => {
        this.mediaList = data;
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

  deleteMedia(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this media?');

    if (!confirmed) {
      return;
    }

    this.mediaService.delete(id).subscribe({
      next: () => {
        this.mediaList = this.mediaList.filter((media) => media.id !== id);
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Delete Media error:', error);
        alert(error.error?.message || 'Unable to delete media.');
      },
    });
  }

  // ==========================
  // Preview Helpers
  // ==========================

  isImage(media: Media): boolean {
    const ext = media.fileType?.toLowerCase();

    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext);
  }

  isPdf(media: Media): boolean {
    return media.fileType?.toLowerCase() === '.pdf';
  }

  isVideo(media: Media): boolean {
    const ext = media.fileType?.toLowerCase();

    return ['.mp4', '.avi', '.mov', '.mkv', '.webm'].includes(ext);
  }

  getFileUrl(path: string): string {
    return `https://localhost:7103${path}`;
  }
}
