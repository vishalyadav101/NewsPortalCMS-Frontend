export interface ReportDashboard {
  totalNews: number;
  totalCategories: number;
  totalSubCategories: number;
  totalTags: number;
  totalUsers: number;
  totalComments: number;
  totalAdvertisements: number;
  totalNotifications: number;
  totalStaticPages: number;
  totalMenus: number;
  totalAuditLogs: number;
}

export interface NewsReport {
  id: number;
  title: string;
  categoryName: string;
  authorName: string;
  publishedDate: string;
  isPublished: boolean;
}

export interface CommentReport {
  id: string;
  userName: string;
  newsTitle: string;
  comment: string;
  createdAt: string;
}

export interface UserActivityReport {
  userId: number;
  userName: string;
  newsCreated: number;
  commentsPosted: number;
  auditLogsGenerated: number;
}
