export interface SubCategory {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  createdDate: string;
  updatedDate: string | null;
}

export interface SubCategoryRequest {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
}
