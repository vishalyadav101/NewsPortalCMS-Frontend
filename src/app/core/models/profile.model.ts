export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profileImage: string | null;
  isActive: boolean;
  createdDate: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}
