import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WebsiteSetting, WebsiteSettingRequest } from '../../../core/models/website-setting.model';

import { WebsiteSettingService } from '../../../core/services/website-setting';

@Component({
  selector: 'app-website-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './website-settings.html',
  styleUrl: './website-settings.css',
})
export class WebsiteSettings implements OnInit {
  private readonly service = inject(WebsiteSettingService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // TABS
  // ==========================================

  activeTab: 'general' | 'branding' | 'contact' | 'social' | 'seo' | 'footer' = 'general';

  setActiveTab(tab: 'general' | 'branding' | 'contact' | 'social' | 'seo' | 'footer'): void {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  // ==========================================
  // SETTINGS
  // ==========================================

  settingId: number | null = null;

  isLoading = true;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  // ==========================================
  // FILES
  // ==========================================

  logoFile: File | null = null;
  faviconFile: File | null = null;

  logoPreviewUrl = '';
  faviconPreviewUrl = '';

  // ==========================================
  // SETTINGS MODEL
  // ==========================================

  settings: WebsiteSettingRequest & {
    address: string;
  } = {
    // GENERAL
    websiteName: '',
    websiteTagline: '',
    organizationName: '',
    websiteUrl: '',
    websiteDescription: '',
    defaultLanguage: 'English',
    timeZone: 'Asia/Kolkata',
    copyrightText: '',

    // BRANDING
    logoUrl: '',
    faviconUrl: '',

    defaultNewsImageMediaId: 0,
    defaultSocialImageMediaId: 0,

    primaryColor: '#2563eb',
    secondaryColor: '#111827',

    // CONTACT
    contactEmail: '',
    editorialEmail: '',
    advertisingEmail: '',
    contactPhone: '',
    whatsAppNumber: '',
    officeAddress: '',
    googleMapsUrl: '',

    // SOCIAL MEDIA
    facebookUrl: '',
    instagramUrl: '',
    youTubeUrl: '',
    twitterUrl: '',
    linkedInUrl: '',
    telegramUrl: '',
    whatsAppChannelUrl: '',

    // SEO
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    googleSiteVerification: '',

    // FOOTER
    footerText: '',

    // Existing HTML field
    address: '',
  };

  // ==========================================
  // LANGUAGE
  // ==========================================

  languages: string[] = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Bengali'];

  // ==========================================
  // TIME ZONES
  // ==========================================

  timeZones: string[] = [
    'Asia/Kolkata',
    'UTC',
    'Asia/Dubai',
    'Asia/Singapore',
    'Europe/London',
    'America/New_York',
  ];

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadSettings();
  }

  // ==========================================
  // GET SETTINGS
  // ==========================================

  loadSettings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.getSettings().subscribe({
      next: (data: WebsiteSetting) => {
        console.log('Website Settings API:', data);

        this.settingId = data.id;

        this.settings = {
          // GENERAL
          websiteName: data.websiteName ?? '',
          websiteTagline: data.websiteTagline ?? '',
          organizationName: data.organizationName ?? '',
          websiteUrl: data.websiteUrl ?? '',
          websiteDescription: data.websiteDescription ?? '',
          defaultLanguage: data.defaultLanguage ?? 'English',
          timeZone: data.timeZone ?? 'Asia/Kolkata',
          copyrightText: data.copyrightText ?? '',

          // BRANDING
          logoUrl: data.logoUrl ?? '',
          faviconUrl: data.faviconUrl ?? '',

          defaultNewsImageMediaId: data.defaultNewsImageMediaId ?? 0,

          defaultSocialImageMediaId: data.defaultSocialImageMediaId ?? 0,

          primaryColor: data.primaryColor ?? '#2563eb',

          secondaryColor: data.secondaryColor ?? '#111827',

          // CONTACT
          contactEmail: data.contactEmail ?? '',
          editorialEmail: data.editorialEmail ?? '',
          advertisingEmail: data.advertisingEmail ?? '',
          contactPhone: data.contactPhone ?? '',
          whatsAppNumber: data.whatsAppNumber ?? '',
          officeAddress: data.officeAddress ?? '',
          googleMapsUrl: data.googleMapsUrl ?? '',

          // SOCIAL MEDIA
          facebookUrl: data.facebookUrl ?? '',
          instagramUrl: data.instagramUrl ?? '',
          youTubeUrl: data.youTubeUrl ?? '',
          twitterUrl: data.twitterUrl ?? '',
          linkedInUrl: data.linkedInUrl ?? '',
          telegramUrl: data.telegramUrl ?? '',
          whatsAppChannelUrl: data.whatsAppChannelUrl ?? '',

          // SEO
          metaTitle: data.metaTitle ?? '',
          metaDescription: data.metaDescription ?? '',
          metaKeywords: data.metaKeywords ?? '',
          canonicalUrl: data.canonicalUrl ?? '',
          googleSiteVerification: data.googleSiteVerification ?? '',

          // FOOTER
          footerText: data.footerText ?? '',

          // Existing HTML field
          address: data.officeAddress ?? '',
        };

        // Logo preview
        this.logoPreviewUrl = this.getMediaUrl(data.logoUrl);

        // Favicon preview
        this.faviconPreviewUrl = this.getMediaUrl(data.faviconUrl);

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Website Settings GET Error:', error);

        this.errorMessage = 'Unable to load website settings.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SAVE
  // ==========================================

  save(): void {
    // ==========================================
    // VALIDATION
    // ==========================================

    const validationResult = this.validateSettings();

    if (!validationResult.valid) {
      // Automatically open required field tab
      this.activeTab = validationResult.tab;

      this.errorMessage = validationResult.message;

      this.successMessage = '';

      this.cdr.detectChanges();

      return;
    }

    // ==========================================
    // SAVE START
    // ==========================================

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Backend field sync
    this.settings.officeAddress = this.settings.address;

    const request: WebsiteSettingRequest = {
      // GENERAL
      websiteName: this.settings.websiteName,

      websiteTagline: this.settings.websiteTagline,

      organizationName: this.settings.organizationName,

      websiteUrl: this.settings.websiteUrl,

      websiteDescription: this.settings.websiteDescription,

      defaultLanguage: this.settings.defaultLanguage,

      timeZone: this.settings.timeZone,

      copyrightText: this.settings.copyrightText,

      // BRANDING
      logoUrl: this.settings.logoUrl,

      faviconUrl: this.settings.faviconUrl,

      defaultNewsImageMediaId: this.settings.defaultNewsImageMediaId,

      defaultSocialImageMediaId: this.settings.defaultSocialImageMediaId,

      primaryColor: this.settings.primaryColor,

      secondaryColor: this.settings.secondaryColor,

      // CONTACT
      contactEmail: this.settings.contactEmail,

      editorialEmail: this.settings.editorialEmail,

      advertisingEmail: this.settings.advertisingEmail,

      contactPhone: this.settings.contactPhone,

      whatsAppNumber: this.settings.whatsAppNumber,

      officeAddress: this.settings.officeAddress,

      googleMapsUrl: this.settings.googleMapsUrl,

      // SOCIAL
      facebookUrl: this.settings.facebookUrl,

      instagramUrl: this.settings.instagramUrl,

      youTubeUrl: this.settings.youTubeUrl,

      twitterUrl: this.settings.twitterUrl,

      linkedInUrl: this.settings.linkedInUrl,

      telegramUrl: this.settings.telegramUrl,

      whatsAppChannelUrl: this.settings.whatsAppChannelUrl,

      // SEO
      metaTitle: this.settings.metaTitle,

      metaDescription: this.settings.metaDescription,

      metaKeywords: this.settings.metaKeywords,

      canonicalUrl: this.settings.canonicalUrl,

      googleSiteVerification: this.settings.googleSiteVerification,

      // FOOTER
      footerText: this.settings.footerText,
    };

    // ==========================================
    // UPDATE
    // ==========================================

    if (this.settingId) {
      this.service.update(this.settingId, request).subscribe({
        next: () => {
          this.uploadFiles();
        },

        error: (error) => {
          console.error('Website Settings UPDATE Error:', error);

          this.errorMessage = 'Unable to save website settings.';

          this.isSaving = false;

          this.cdr.detectChanges();
        },
      });

      return;
    }

    // ==========================================
    // CREATE
    // ==========================================

    this.service.create(request).subscribe({
      next: (response) => {
        this.settingId = response.id;

        this.uploadFiles();
      },

      error: (error) => {
        console.error('Website Settings CREATE Error:', error);

        this.errorMessage = 'Unable to create website settings.';

        this.isSaving = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // VALIDATION
  // ==========================================

  private validateSettings(): {
    valid: boolean;
    message: string;
    tab: 'general' | 'branding' | 'contact' | 'social' | 'seo' | 'footer';
  } {
    // ==========================================
    // GENERAL
    // ==========================================

    if (!this.settings.websiteName.trim()) {
      return {
        valid: false,
        message: 'Website Name is required.',
        tab: 'general',
      };
    }

    if (!this.settings.organizationName.trim()) {
      return {
        valid: false,
        message: 'Company / Organization Name is required.',
        tab: 'general',
      };
    }

    if (!this.settings.websiteUrl.trim()) {
      return {
        valid: false,
        message: 'Website URL is required.',
        tab: 'general',
      };
    }

    if (!this.isValidUrl(this.settings.websiteUrl)) {
      return {
        valid: false,
        message: 'Please enter a valid Website URL.',
        tab: 'general',
      };
    }

    if (!this.settings.websiteDescription.trim()) {
      return {
        valid: false,
        message: 'Website Description is required.',
        tab: 'general',
      };
    }

    if (!this.settings.defaultLanguage.trim()) {
      return {
        valid: false,
        message: 'Default Language is required.',
        tab: 'general',
      };
    }

    if (!this.settings.timeZone.trim()) {
      return {
        valid: false,
        message: 'Time Zone is required.',
        tab: 'general',
      };
    }

    if (!this.settings.copyrightText.trim()) {
      return {
        valid: false,
        message: 'Copyright Text is required.',
        tab: 'general',
      };
    }

    // ==========================================
    // BRANDING
    // ==========================================

    if (!this.settings.logoUrl.trim() && !this.logoFile) {
      return {
        valid: false,
        message: 'Website Logo is required.',
        tab: 'branding',
      };
    }

    if (!this.settings.faviconUrl.trim() && !this.faviconFile) {
      return {
        valid: false,
        message: 'Website Favicon is required.',
        tab: 'branding',
      };
    }

    // ==========================================
    // CONTACT
    // ==========================================

    if (!this.settings.contactEmail.trim()) {
      return {
        valid: false,
        message: 'Contact Email is required.',
        tab: 'contact',
      };
    }

    if (!this.isValidEmail(this.settings.contactEmail)) {
      return {
        valid: false,
        message: 'Please enter a valid Contact Email.',
        tab: 'contact',
      };
    }

    // Optional Editorial Email
    if (this.settings.editorialEmail.trim() && !this.isValidEmail(this.settings.editorialEmail)) {
      return {
        valid: false,
        message: 'Please enter a valid Editorial Email.',
        tab: 'contact',
      };
    }

    // Optional Advertising Email
    if (
      this.settings.advertisingEmail.trim() &&
      !this.isValidEmail(this.settings.advertisingEmail)
    ) {
      return {
        valid: false,
        message: 'Please enter a valid Advertising Email.',
        tab: 'contact',
      };
    }

    // Optional Google Maps URL
    if (this.settings.googleMapsUrl.trim() && !this.isValidUrl(this.settings.googleMapsUrl)) {
      return {
        valid: false,
        message: 'Please enter a valid Google Maps URL.',
        tab: 'contact',
      };
    }

    // ==========================================
    // SOCIAL MEDIA
    // ==========================================

    const socialUrls = [
      {
        value: this.settings.facebookUrl,
        name: 'Facebook URL',
      },
      {
        value: this.settings.instagramUrl,
        name: 'Instagram URL',
      },
      {
        value: this.settings.youTubeUrl,
        name: 'YouTube URL',
      },
      {
        value: this.settings.twitterUrl,
        name: 'X / Twitter URL',
      },
      {
        value: this.settings.linkedInUrl,
        name: 'LinkedIn URL',
      },
      {
        value: this.settings.telegramUrl,
        name: 'Telegram URL',
      },
      {
        value: this.settings.whatsAppChannelUrl,
        name: 'WhatsApp Channel URL',
      },
    ];

    for (const social of socialUrls) {
      if (social.value.trim() && !this.isValidUrl(social.value)) {
        return {
          valid: false,
          message: `Please enter a valid ${social.name}.`,
          tab: 'social',
        };
      }
    }

    // ==========================================
    // SEO
    // ==========================================

    if (!this.settings.metaTitle.trim()) {
      return {
        valid: false,
        message: 'Default Meta Title is required.',
        tab: 'seo',
      };
    }

    if (!this.settings.metaDescription.trim()) {
      return {
        valid: false,
        message: 'Default Meta Description is required.',
        tab: 'seo',
      };
    }

    // Optional Canonical URL
    if (this.settings.canonicalUrl.trim() && !this.isValidUrl(this.settings.canonicalUrl)) {
      return {
        valid: false,
        message: 'Please enter a valid Canonical URL.',
        tab: 'seo',
      };
    }

    // ==========================================
    // ALL VALID
    // ==========================================

    return {
      valid: true,
      message: '',
      tab: 'general',
    };
  }

  // ==========================================
  // EMAIL VALIDATION
  // ==========================================

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email.trim());
  }

  // ==========================================
  // URL VALIDATION
  // ==========================================

  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url.trim());

      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  // ==========================================
  // LOGO FILE
  // ==========================================

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.logoFile = input.files[0];

      this.logoPreviewUrl = URL.createObjectURL(this.logoFile);
    }
  }

  // ==========================================
  // FAVICON FILE
  // ==========================================

  onFaviconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.faviconFile = input.files[0];

      this.faviconPreviewUrl = URL.createObjectURL(this.faviconFile);
    }
  }

  // ==========================================
  // UPLOAD FILES
  // ==========================================

  private uploadFiles(): void {
    if (!this.settingId) {
      this.finishSave();
      return;
    }

    const uploads: Promise<void>[] = [];

    // LOGO
    if (this.logoFile) {
      uploads.push(
        new Promise((resolve) => {
          this.service.uploadLogo(this.settingId!, this.logoFile!).subscribe({
            next: () => resolve(),

            error: (error) => {
              console.error('Logo Upload Error:', error);

              resolve();
            },
          });
        }),
      );
    }

    // FAVICON
    if (this.faviconFile) {
      uploads.push(
        new Promise((resolve) => {
          this.service.uploadFavicon(this.settingId!, this.faviconFile!).subscribe({
            next: () => resolve(),

            error: (error) => {
              console.error('Favicon Upload Error:', error);

              resolve();
            },
          });
        }),
      );
    }

    Promise.all(uploads).then(() => {
      this.finishSave();
    });
  }

  // ==========================================
  // FINISH SAVE
  // ==========================================

  private finishSave(): void {
    this.isSaving = false;

    this.logoFile = null;
    this.faviconFile = null;

    this.successMessage = 'Website settings saved successfully.';

    this.loadSettings();

    this.cdr.detectChanges();
  }

  // ==========================================
  // MEDIA URL
  // ==========================================

  getMediaUrl(path: string | null): string {
    if (!path) {
      return '';
    }

    if (path.startsWith('http')) {
      return path;
    }

    return `https://localhost:7103${path}`;
  }
}
