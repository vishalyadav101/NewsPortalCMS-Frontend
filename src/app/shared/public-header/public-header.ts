import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WebsiteSettingService } from '../../core/services/website-setting';
import { WebsiteSetting } from '../../core/models/website-setting.model';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-header.html',
  styleUrl: './public-header.css',
})
export class PublicHeader implements OnInit {
  private readonly websiteSettingService = inject(WebsiteSettingService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly currentDate = new Date();

  settings: WebsiteSetting | null = null;

  isLoadingSettings = true;

  get formattedDate(): string {
    return this.currentDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  ngOnInit(): void {
    this.loadWebsiteSettings();
  }

  // ==========================================
  // LOAD WEBSITE SETTINGS
  // ==========================================

  private loadWebsiteSettings(): void {
    this.websiteSettingService.getSettings().subscribe({
      next: (data) => {
        this.settings = data;

        this.isLoadingSettings = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Public Header Settings Error:', error);

        this.settings = null;

        this.isLoadingSettings = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SOCIAL MEDIA URL
  // ==========================================

  getSocialUrl(url: string | null | undefined): string {
    return url?.trim() || '';
  }
}
