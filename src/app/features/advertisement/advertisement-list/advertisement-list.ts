import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdvertisementService } from '../../../core/services/advertisement';
import { Advertisement } from '../../../core/models/advertisement.model';

@Component({
  selector: 'app-advertisement-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './advertisement-list.html',
  styleUrl: './advertisement-list.css',
})
export class AdvertisementList implements OnInit {
  private readonly advertisementService = inject(AdvertisementService);

  private readonly cdr = inject(ChangeDetectorRef);

  advertisements: Advertisement[] = [];

  isLoading = true;

  errorMessage = '';

  ngOnInit(): void {
    this.loadAdvertisements();
  }

  loadAdvertisements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.advertisementService.getAll().subscribe({
      next: (data) => {
        this.advertisements = data;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Advertisement loading error:', error);

        this.errorMessage = 'Unable to load advertisements.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteAdvertisement(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this advertisement?');

    if (!confirmed) {
      return;
    }

    this.advertisementService.delete(id).subscribe({
      next: () => {
        this.advertisements = this.advertisements.filter(
          (advertisement) => advertisement.id !== id,
        );

        this.cdr.detectChanges();

        alert('Advertisement deleted successfully.');
      },

      error: (error) => {
        console.error('Advertisement delete error:', error);

        alert(error.error?.message ?? 'Unable to delete advertisement.');
      },
    });
  }
}
