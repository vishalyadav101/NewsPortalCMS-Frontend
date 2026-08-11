import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AdvertisementService } from '../../../core/services/advertisement';

import { AdvertisementRequest } from '../../../core/models/advertisement.model';

@Component({
  selector: 'app-advertisement-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './advertisement-form.html',
  styleUrl: './advertisement-form.css',
})
export class AdvertisementForm implements OnInit {
  private readonly advertisementService = inject(AdvertisementService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  advertisement: AdvertisementRequest = {
    title: '',
    description: '',
    bannerFile: null,
    redirectUrl: '',
    position: 1,
    startDate: '',
    endDate: '',
    isActive: true,
    displayOrder: 1,
  };

  advertisementId: string | null = null;

  isEditMode = false;

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  /*
   * Preview URL for newly selected banner
   */
  previewUrl: string | null = null;

  /*
   * Existing banner URL while editing
   */
  existingBannerUrl: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.advertisementId = id;

      this.isEditMode = true;

      this.loadAdvertisement();
    }
  }

  loadAdvertisement(): void {
    if (!this.advertisementId) {
      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.advertisementService.getById(this.advertisementId).subscribe({
      next: (data) => {
        this.advertisement = {
          title: data.title,
          description: data.description ?? '',
          bannerFile: null,
          redirectUrl: data.redirectUrl ?? '',
          position: data.position,
          startDate: data.startDate.substring(0, 16),
          endDate: data.endDate.substring(0, 16),
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        };

        /*
         * Existing banner
         */
        if (data.bannerUrl) {
          this.existingBannerUrl = this.getFullImageUrl(data.bannerUrl);
        }

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Advertisement loading error:', error);

        this.errorMessage = 'Unable to load advertisement.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  /*
   * Banner file selection
   */
  onBannerSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    /*
     * Allowed image types
     */
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Only JPG, JPEG, PNG and WEBP images are allowed.';

      input.value = '';

      this.advertisement.bannerFile = null;

      this.previewUrl = null;

      return;
    }

    /*
     * Maximum 5 MB
     */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      this.errorMessage = 'Banner size cannot exceed 5 MB.';

      input.value = '';

      this.advertisement.bannerFile = null;

      this.previewUrl = null;

      return;
    }

    this.errorMessage = '';

    this.advertisement.bannerFile = file;

    /*
     * Create preview
     */
    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result as string;

      /*
       * New image selected,
       * so existing image is hidden.
       */
      this.existingBannerUrl = null;

      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  /*
   * Full image URL
   */
  private getFullImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    return `https://localhost:7103${imageUrl}`;
  }

  save(): void {
    this.errorMessage = '';

    /*
     * Title validation
     */
    if (!this.advertisement.title.trim()) {
      this.errorMessage = 'Title is required.';

      return;
    }

    /*
     * Banner required only for Create
     */
    if (!this.isEditMode && !this.advertisement.bannerFile) {
      this.errorMessage = 'Advertisement banner is required.';

      return;
    }

    /*
     * Date validation
     */
    if (this.advertisement.startDate && this.advertisement.endDate) {
      const start = new Date(this.advertisement.startDate);

      const end = new Date(this.advertisement.endDate);

      if (end < start) {
        this.errorMessage = 'End date must be greater than or equal to start date.';

        return;
      }
    }

    this.isSaving = true;

    /*
     * Update
     */
    if (this.isEditMode) {
      this.advertisementService.update(this.advertisementId!, this.advertisement).subscribe({
        next: () => {
          this.isSaving = false;

          this.router.navigate(['/advertisements']);
        },

        error: (error) => {
          console.error('Advertisement update error:', error);

          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to update advertisement.';

          this.cdr.detectChanges();
        },
      });

      return;
    }

    /*
     * Create
     */
    this.advertisementService.create(this.advertisement).subscribe({
      next: () => {
        this.isSaving = false;

        this.router.navigate(['/advertisements']);
      },

      error: (error) => {
        console.error('Advertisement create error:', error);

        this.isSaving = false;

        this.errorMessage = error.error?.message ?? 'Unable to save advertisement.';

        this.cdr.detectChanges();
      },
    });
  }
}
