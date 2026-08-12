import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification';

import {
  NotificationRequest,
  UpdateNotificationRequest,
} from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notification-form.html',
  styleUrl: './notification-form.css',
})
export class NotificationForm implements OnInit {
  private readonly notificationService = inject(NotificationService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly cdr = inject(ChangeDetectorRef);

  notification: NotificationRequest = {
    title: '',
    message: '',
    type: 'Info',
    module: '',
    entityId: '',
  };

  isRead = false;

  readDate: string | null = null;

  notificationId: number | null = null;

  isEditMode = false;

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.notificationId = Number(id);

      this.isEditMode = true;

      this.loadNotification();
    }
  }

  loadNotification(): void {
    if (this.notificationId === null) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.notificationService.getById(this.notificationId).subscribe({
      next: (data) => {
        this.notification = {
          title: data.title,
          message: data.message,
          type: data.type,
          module: data.module ?? '',
          entityId: data.entityId ?? '',
        };

        this.isRead = data.isRead;

        this.readDate = data.readDate ? data.readDate.substring(0, 16) : null;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Notification loading error:', error);

        this.errorMessage = 'Unable to load notification.';

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  save(): void {
    this.errorMessage = '';

    if (!this.notification.title.trim()) {
      this.errorMessage = 'Title is required.';

      return;
    }

    if (!this.notification.message.trim()) {
      this.errorMessage = 'Message is required.';

      return;
    }

    if (!this.notification.type.trim()) {
      this.errorMessage = 'Notification type is required.';

      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      this.updateNotification();
    } else {
      this.createNotification();
    }
  }

  private createNotification(): void {
    this.notificationService.create(this.notification).subscribe({
      next: () => {
        this.isSaving = false;

        this.router.navigate(['/notifications']);
      },

      error: (error) => {
        console.error('Notification create error:', error);

        this.isSaving = false;

        this.errorMessage =
          error.error?.message ?? error.error?.Message ?? 'Unable to create notification.';

        this.cdr.detectChanges();
      },
    });
  }

  private updateNotification(): void {
    if (this.notificationId === null) {
      return;
    }

    const request: UpdateNotificationRequest = {
      title: this.notification.title,
      message: this.notification.message,
      type: this.notification.type,
      isRead: this.isRead,
      module: this.notification.module,
      entityId: this.notification.entityId,
      readDate: this.readDate,
    };

    this.notificationService.update(this.notificationId, request).subscribe({
      next: () => {
        this.isSaving = false;

        this.router.navigate(['/notifications']);
      },

      error: (error) => {
        console.error('Notification update error:', error);

        this.isSaving = false;

        this.errorMessage =
          error.error?.message ?? error.error?.Message ?? 'Unable to update notification.';

        this.cdr.detectChanges();
      },
    });
  }
}
