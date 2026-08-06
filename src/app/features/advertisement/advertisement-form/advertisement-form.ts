import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AdvertisementService } from '../../../core/services/advertisement';
import { MediaService } from '../../../core/services/media';

import { AdvertisementRequest } from '../../../core/models/advertisement.model';

import { Media } from '../../../core/models/media.model';

@Component({
  selector: 'app-advertisement-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './advertisement-form.html',
  styleUrl: './advertisement-form.css',
})
export class AdvertisementForm implements OnInit {
  private readonly advertisementService = inject(AdvertisementService);

  private readonly mediaService = inject(MediaService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  advertisement: AdvertisementRequest = {
    title: '',
    description: '',
    mediaId: 0,
    redirectUrl: '',
    position: 1,
    startDate: '',
    endDate: '',
    isActive: true,
    displayOrder: 1,
  };

  mediaList: Media[] = [];

  advertisementId: string | null = null;

  isEditMode = false;
  isLoading = false;
  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadMedia();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.advertisementId = id;

      this.isEditMode = true;

      this.loadAdvertisement();
    }
  }

  loadMedia(): void {
    this.mediaService.getAll().subscribe({
      next: (data) => {
        this.mediaList = data;
      },
    });
  }

  loadAdvertisement(): void {
    if (!this.advertisementId) return;

    this.isLoading = true;

    this.advertisementService.getById(this.advertisementId).subscribe({
      next: (data) => {
        this.advertisement = {
          title: data.title,
          description: data.description,
          mediaId: data.mediaId,
          redirectUrl: data.redirectUrl,
          position: data.position,
          startDate: data.startDate.substring(0, 16),
          endDate: data.endDate.substring(0, 16),
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        };

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage = 'Unable to load advertisement.';

        this.isLoading = false;
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.advertisement.title.trim()) {
      this.errorMessage = 'Title is required.';

      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      this.advertisementService.update(this.advertisementId!, this.advertisement).subscribe({
        next: () => {
          this.router.navigate(['/advertisements']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to update advertisement.';
        },
      });
    } else {
      this.advertisementService.create(this.advertisement).subscribe({
        next: () => {
          this.router.navigate(['/advertisements']);
        },

        error: (error) => {
          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to save advertisement.';
        },
      });
    }
  }
}
