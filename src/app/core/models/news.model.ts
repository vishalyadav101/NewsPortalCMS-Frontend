export interface News {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;

  // API se path aayega
  featuredImage: string | null;
  featuredVideo: string | null;

  author: string;
  publishDate: string;

  isPublished: boolean;
  isFeatured: boolean;

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

  // Upload ke liye
  featuredImage: File | null;
  featuredVideo: File | null;

  author: string;
  publishDate: string;

  isPublished: boolean;
  isFeatured: boolean;

  categoryId: number;
}
