export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  module: string | null;
  entityId: string | null;
  isRead: boolean;
  type: string;
  createdDate: string;
  readDate: string | null;
}

export interface NotificationRequest {
  title: string;
  message: string;
  type: string;
  module: string;
  entityId: string;
}

export interface UpdateNotificationRequest {
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  module: string;
  entityId: string;
  readDate: string | null;
}
