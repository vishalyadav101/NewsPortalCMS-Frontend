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

export interface CreateComment {
  newsId: number;
  userId: string | null;
  name: string;
  email: string;
  content: string;
}

export interface UpdateComment {
  newsId: number;
  userId: string | null;
  name: string;
  email: string;
  content: string;
}