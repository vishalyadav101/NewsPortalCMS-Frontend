export interface Menu {
  id: number;
  name: string;
  location: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface MenuRequest {
  name: string;
  location: string;
  description: string;
  isActive: boolean;
}
