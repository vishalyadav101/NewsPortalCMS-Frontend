export interface News {
  id: number;

  title: string;

  slug: string;

  shortDescription: string;

  content: string;

  featuredImage: string | null;

  featuredVideo: string | null;

  author: string;

  publishDate: string;

  isPublished: boolean;

  isFeatured: boolean;

  viewCount: number;

  categoryId: number;

  subCategoryId: number;

  categoryName: string;

  subCategoryName: string;

  createdAt: string;

  updatedAt: string | null;
}

export interface NewsPagedResponse {
  items: News[];

  pageNumber: number;

  pageSize: number;

  totalCount: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
}

export interface NewsRequest {
  title: string;

  slug: string;

  shortDescription: string;

  content: string;

  featuredImage: File | null;

  featuredVideo: File | null;

  author: string;

  publishDate: string;

  isPublished: boolean;

  isFeatured: boolean;

  categoryId: number;

  subCategoryId: number;
}
