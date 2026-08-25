
// =====================================================
// PUBLIC NEWS MODEL
// Used by /api/publicnews endpoints
// =====================================================

export interface PublicNews {
  id: number;

  title: string;

  slug: string;

  shortDescription: string;

  featuredImage: string | null;

  author: string | null;

  publishDate: string;

  viewCount: number;

  categoryId: number;

  categoryName: string;
}


// =====================================================
// PUBLIC NEWS DETAILS
// Used by /api/publicnews/{slug}
// =====================================================

export interface PublicNewsDetails {
  id: number;

  title: string;

  slug: string;

  shortDescription: string;

  content: string;

  featuredImage: string | null;

  featuredVideo: string | null;

  author: string | null;

  publishDate: string;

  viewCount: number;

  categoryId: number;

  categoryName: string;

  tags: string[];

  comments: PublicComment[];
}


// =====================================================
// PUBLIC COMMENT
// =====================================================

export interface PublicComment {
  id: number;

  name: string;

  content: string;

  createdDate: string;
}
