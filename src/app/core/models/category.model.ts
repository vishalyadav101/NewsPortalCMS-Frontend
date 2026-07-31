export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  createdDate: string;
  updatedDate: string | null;
}

export interface CategoryRequest {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
}
