export interface News {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  author: string;
  publishDate: string;
  isPublished: boolean;
  viewCount: number;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface NewsRequest {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  author: string;
  publishDate: string;
  isPublished: boolean;
  categoryId: number;
}
