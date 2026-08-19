import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Profile, UpdateProfileRequest } from '../../core/models/profile.model';

import { ProfileService } from '../../core/services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // PROFILE
  // ==========================================

  profile: Profile | null = null;

  firstName = '';
  lastName = '';

  // ==========================================
  // IMAGE
  // ==========================================

  selectedFile: File | null = null;

  selectedImagePreview: string | null = null;

  // ==========================================
  // STATES
  // ==========================================

  isLoading = true;

  isSaving = false;

  isUploadingImage = false;

  errorMessage = '';

  successMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadProfile();
  }

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getProfile().subscribe({
      next: (response) => {
        console.log('Profile API Response:', response);

        this.profile = response;

        this.firstName = response.firstName || '';
        this.lastName = response.lastName || '';

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Profile GET Error:', error);

        this.errorMessage = 'Unable to load profile. Please try again.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  updateProfile(form: NgForm): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });

      return;
    }

    const updatedFirstName = this.firstName.trim();
    const updatedLastName = this.lastName.trim();

    const request: UpdateProfileRequest = {
      firstName: updatedFirstName,
      lastName: updatedLastName,
    };

    this.isSaving = true;

    this.profileService.updateProfile(request).subscribe({
      next: () => {
        console.log('Profile updated successfully');

        // IMPORTANT:
        // PUT response ko profile object mat samjho.
        // Existing profile ko preserve karo aur sirf
        // updated fields local UI me change karo.

        if (this.profile) {
          this.profile = {
            ...this.profile,
            firstName: updatedFirstName,
            lastName: updatedLastName,
          };
        }

        this.firstName = updatedFirstName;
        this.lastName = updatedLastName;

        this.isSaving = false;

        this.successMessage = 'Profile updated successfully.';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '';

          this.cdr.detectChanges();
        }, 3000);
      },

      error: (error) => {
        console.error('Profile Update Error:', error);

        this.errorMessage = error?.error?.message || 'Unable to update profile.';

        this.isSaving = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // FILE SELECT
  // ==========================================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Profile image must be less than 5 MB.';

      input.value = '';

      return;
    }

    // Allowed image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Only JPG, JPEG, PNG and WEBP images are allowed.';

      input.value = '';

      return;
    }

    this.errorMessage = '';

    this.selectedFile = file;

    // Preview
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImagePreview = reader.result as string;

      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  // ==========================================
  // UPLOAD IMAGE
  // ==========================================

  uploadImage(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please choose an image first.';

      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.isUploadingImage = true;

    this.profileService.uploadProfileImage(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Profile Image Upload Response:', response);

        this.profile = response;

        this.selectedFile = null;
        this.selectedImagePreview = null;

        this.isUploadingImage = false;

        this.successMessage = 'Profile image uploaded successfully.';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },

      error: (error) => {
        console.error('Profile Image Upload Error:', error);

        this.errorMessage = error?.error?.message || 'Unable to upload profile image.';

        this.isUploadingImage = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // IMAGE URL
  // ==========================================

  getProfileImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      return '';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    return `https://localhost:7103${imagePath}`;
  }

  // ==========================================
  // INITIAL
  // ==========================================

  getInitials(): string {
    if (!this.profile) {
      return 'U';
    }

    const first = this.profile.firstName?.charAt(0) || '';

    const last = this.profile.lastName?.charAt(0) || '';

    return (first + last).toUpperCase();
  }

  // ==========================================
  // DATE
  // ==========================================

  getMemberSince(): string {
    if (!this.profile?.createdDate) {
      return '';
    }

    return this.profile.createdDate;
  }
}
