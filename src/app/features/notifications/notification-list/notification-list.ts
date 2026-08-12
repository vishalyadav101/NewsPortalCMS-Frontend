import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.css',
})
export class NotificationList implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  notifications: Notification[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.notificationService.getAll().subscribe({
      next: (data) => {
        this.notifications = data;

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Unable to load notifications:', error);

        this.errorMessage = 'Unable to load notifications.';
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  deleteNotification(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this notification?');

    if (!confirmed) {
      return;
    }

    this.notificationService.delete(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((notification) => notification.id !== id);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Unable to delete notification:', error);

        alert(error.error?.message ?? error.error?.Message ?? 'Unable to delete notification.');
      },
    });
  }
}
