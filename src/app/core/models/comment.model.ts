export interface Comment {
  id: string;
  newsId: number;
  userId: string | null;

  name: string;
  email: string;
  content: string;

  isApproved: boolean;
  isActive: boolean;

  createdDate: string;
  updatedDate: string | null;
}

export interface CommentRequest {
  newsId: number;
  userId: string | null;

  name: string;
  email: string;
  content: string;
}

export interface UpdateCommentRequest {
  name: string;
  email: string;
  content: string;

  isApproved: boolean;
  isActive: boolean;
}
