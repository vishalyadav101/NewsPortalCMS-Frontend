export interface StaticPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  status: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface StaticPageRequest {
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  status: boolean;
}
