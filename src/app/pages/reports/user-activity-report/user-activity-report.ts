import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportService } from '../../../core/services/report.service';
import { UserActivityReport } from '../../../core/models/report.model';

@Component({
  selector: 'app-user-activity-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-activity-report.html',
  styleUrl: './user-activity-report.css',
})
export class UserActivityReportComponent implements OnInit {
  private readonly reportService = inject(ReportService);

  private readonly cdr = inject(ChangeDetectorRef);

  // ==========================================
  // USER ACTIVITY
  // ==========================================

  activities: UserActivityReport[] = [];

  filteredActivities: UserActivityReport[] = [];

  // ==========================================
  // SEARCH
  // ==========================================

  searchText = '';

  // ==========================================
  // STATES
  // ==========================================

  isLoading = true;

  errorMessage = '';

  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadUserActivity();
  }

  // ==========================================
  // LOAD USER ACTIVITY REPORT
  // ==========================================

  loadUserActivity(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.reportService.getUserActivityReport().subscribe({
      next: (response) => {
        console.log('User Activity Report:', response);

        this.activities = response ?? [];

        this.filteredActivities = [...this.activities];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('User Activity Report Error:', error);

        this.errorMessage = 'Unable to load user activity report.';

        this.activities = [];

        this.filteredActivities = [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  // SEARCH
  // ==========================================

  onSearch(): void {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      this.filteredActivities = [...this.activities];

      return;
    }

    this.filteredActivities = this.activities.filter((activity) => {
      const userName = activity.userName?.toLowerCase() ?? '';

      return userName.includes(search);
    });
  }

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {
    this.searchText = '';

    this.filteredActivities = [...this.activities];
  }

  // ==========================================
  // REFRESH
  // ==========================================

  refresh(): void {
    this.loadUserActivity();
  }

  // ==========================================
  // TOTAL USERS
  // ==========================================

  get totalUsers(): number {
    return this.activities.length;
  }

  // ==========================================
  // TOTAL NEWS CREATED
  // ==========================================

  get totalNewsCreated(): number {
    return this.activities.reduce((total, activity) => total + activity.newsCreated, 0);
  }

  // ==========================================
  // TOTAL COMMENTS POSTED
  // ==========================================

  get totalCommentsPosted(): number {
    return this.activities.reduce((total, activity) => total + activity.commentsPosted, 0);
  }

  // ==========================================
  // TOTAL AUDIT LOGS
  // ==========================================

  get totalAuditLogsGenerated(): number {
    return this.activities.reduce((total, activity) => total + activity.auditLogsGenerated, 0);
  }
}
