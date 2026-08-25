import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { RouterLink } from '@angular/router';

import { WebsiteSettingService } from '../../core/services/website-setting';
import { WebsiteSetting } from '../../core/models/website-setting.model';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-footer.html',
  styleUrl: './public-footer.css',
})
export class PublicFooter implements OnInit {
  private readonly websiteSettingService = inject(WebsiteSettingService);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // CURRENT YEAR
  // ==========================================

  currentYear = new Date().getFullYear();

  // ==========================================
  // WEBSITE SETTINGS
  // ==========================================

  settings: WebsiteSetting | null = null;

  // ==========================================
  // INIT
  // ==========================================

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

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Website settings error:', error);
      },
    });
  }

  // ==========================================
  // SOCIAL URL
  // ==========================================

  getSocialUrl(url: string | null | undefined): string {
    return url?.trim() || '';
  }
}
