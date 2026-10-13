import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ReportDashboard,
  NewsReport,
  CommentReport,
  UserActivityReport,
} from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://newsportalcms-api.onrender.com/api/Reports';

  // GET /api/Reports/dashboard
  getDashboard(): Observable<ReportDashboard> {
    return this.http.get<ReportDashboard>(`${this.apiUrl}/dashboard`);
  }

  // GET /api/Reports/news
  getNewsReport(): Observable<NewsReport[]> {
    return this.http.get<NewsReport[]>(`${this.apiUrl}/news`);
  }

  // GET /api/Reports/comments
  getCommentsReport(): Observable<CommentReport[]> {
    return this.http.get<CommentReport[]>(`${this.apiUrl}/comments`);
  }

  // GET /api/Reports/user-activity
  getUserActivityReport(): Observable<UserActivityReport[]> {
    return this.http.get<UserActivityReport[]>(`${this.apiUrl}/user-activity`);
  }
}
