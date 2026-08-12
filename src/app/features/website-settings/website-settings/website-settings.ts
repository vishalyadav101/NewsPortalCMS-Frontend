import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WebsiteSettingService } from '../../../core/services/website-setting';

@Component({
  selector: 'app-website-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './website-settings.html',
  styleUrl: './website-settings.css',
})
export class WebsiteSettings implements OnInit {
  private readonly websiteSettingService = inject(WebsiteSettingService);
  private readonly cdr = inject(ChangeDetectorRef);

  settingId: number | null = null;

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  logoFile: File | null = null;
  faviconFile: File | null = null;

  logoPreviewUrl: string | null = null;
  faviconPreviewUrl: string | null = null;

  settings = {
    websiteName: '',
    logoUrl: '',
    faviconUrl: '',
    websiteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youTubeUrl: '',
    linkedInUrl: '',
    footerText: '',
  };

  private readonly apiBaseUrl = 'https://localhost:7103';

  ngOnInit(): void {
    this.loadSettings();
  }

  // =========================
  // LOAD SETTINGS
  // =========================

  loadSettings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.websiteSettingService.get().subscribe({
      next: (data) => {
        this.settingId = data.id;

        this.settings = {
          websiteName: data.websiteName ?? '',
          logoUrl: data.logoUrl ?? '',
          faviconUrl: data.faviconUrl ?? '',
          websiteDescription: data.websiteDescription ?? '',
          contactEmail: data.contactEmail ?? '',
          contactPhone: data.contactPhone ?? '',
          address: data.address ?? '',
          metaTitle: data.metaTitle ?? '',
          metaDescription: data.metaDescription ?? '',
          metaKeywords: data.metaKeywords ?? '',
          facebookUrl: data.facebookUrl ?? '',
          twitterUrl: data.twitterUrl ?? '',
          instagramUrl: data.instagramUrl ?? '',
          youTubeUrl: data.youTubeUrl ?? '',
          linkedInUrl: data.linkedInUrl ?? '',
          footerText: data.footerText ?? '',
        };

        this.logoPreviewUrl = this.getImageUrl(this.settings.logoUrl);

        this.faviconPreviewUrl = this.getImageUrl(this.settings.faviconUrl);

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = error.error?.message ?? 'Unable to load website settings.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // =========================
  // LOGO FILE SELECT
  // =========================

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Invalid logo format. Please select PNG, JPG, JPEG or WEBP.';

      input.value = '';

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Logo size cannot exceed 5 MB.';

      input.value = '';

      return;
    }

    this.logoFile = file;

    this.errorMessage = '';

    this.logoPreviewUrl = URL.createObjectURL(file);
  }

  // =========================
  // FAVICON FILE SELECT
  // =========================

  onFaviconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const allowedTypes = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Invalid favicon format. Please select PNG or ICO.';

      input.value = '';

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Favicon size cannot exceed 5 MB.';

      input.value = '';

      return;
    }

    this.faviconFile = file;

    this.errorMessage = '';

    this.faviconPreviewUrl = URL.createObjectURL(file);
  }

  // =========================
  // IMAGE URL
  // =========================

  getImageUrl(url: string | null): string | null {
    if (!url) {
      return null;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${this.apiBaseUrl}${url}`;
  }

  // =========================
  // SAVE SETTINGS
  // =========================

  save(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.settingId) {
      this.errorMessage = 'Website setting ID not found.';

      return;
    }

    if (!this.settings.websiteName.trim()) {
      this.errorMessage = 'Website name is required.';

      return;
    }

    this.isSaving = true;

    // First save normal settings
    this.websiteSettingService.update(this.settingId, this.settings).subscribe({
      next: () => {
        this.uploadFiles();
      },

      error: (error) => {
        console.error(error);

        this.isSaving = false;

        this.errorMessage = error.error?.message ?? 'Unable to update website settings.';
      },
    });
  }

  // =========================
  // UPLOAD FILES
  // =========================

  private uploadFiles(): void {
    if (this.logoFile) {
      this.websiteSettingService.uploadLogo(this.settingId!, this.logoFile).subscribe({
        next: (response) => {
          this.settings.logoUrl = response.logoUrl;

          this.logoFile = null;

          this.uploadFavicon();
        },

        error: (error) => {
          console.error(error);

          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to upload logo.';
        },
      });

      return;
    }

    this.uploadFavicon();
  }

  // =========================
  // UPLOAD FAVICON
  // =========================

  private uploadFavicon(): void {
    if (this.faviconFile) {
      this.websiteSettingService.uploadFavicon(this.settingId!, this.faviconFile).subscribe({
        next: (response) => {
          this.settings.faviconUrl = response.faviconUrl;

          this.faviconFile = null;

          this.finishSave();
        },

        error: (error) => {
          console.error(error);

          this.isSaving = false;

          this.errorMessage = error.error?.message ?? 'Unable to upload favicon.';
        },
      });

      return;
    }

    this.finishSave();
  }

  // =========================
  // FINISH SAVE
  // =========================

  private finishSave(): void {
    this.isSaving = false;

    this.successMessage = 'Website settings saved successfully.';

    this.cdr.detectChanges();
  }
}
