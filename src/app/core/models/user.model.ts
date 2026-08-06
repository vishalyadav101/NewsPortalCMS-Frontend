export interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profileImage: string | null;
  isActive: boolean;
  createdDate: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profileImage: string | null;
  isActive: boolean;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}