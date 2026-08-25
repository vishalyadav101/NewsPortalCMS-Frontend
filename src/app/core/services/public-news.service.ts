import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicNews {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage?: string | null;
  author?: string | null;
  publishDate: string;
  viewCount: number;
  categoryId: number;
  categoryName: string;
}

export interface PublicNewsDetails extends PublicNews {
  content?: string;
  featuredVideo?: string | null;
  isFeatured?: boolean;
  subCategoryId?: number | null;
  subCategoryName?: string | null;
  tags?: string[];
  comments?: PublicComment[];
}

export interface PublicComment {
  id: number;
  name: string;
  content: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class PublicNewsService {

  private readonly http = inject(HttpClient);

  // =====================================================
  // API URL
  // =====================================================

  private readonly apiUrl =
    'https://localhost:7103/api/publicnews';


  // =====================================================
  // LATEST NEWS
  // GET /api/publicnews/latest?count=10
  // =====================================================

  getLatestNews(count: number = 10): Observable<PublicNews[]> {

    const params = new HttpParams()
      .set('count', count.toString());

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/latest`,
      { params }
    );
  }


  // =====================================================
  // FEATURED NEWS
  // GET /api/publicnews/featured?count=10
  // =====================================================

  getFeaturedNews(count: number = 10): Observable<PublicNews[]> {

    const params = new HttpParams()
      .set('count', count.toString());

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/featured`,
      { params }
    );
  }


  // =====================================================
  // POPULAR NEWS
  // GET /api/publicnews/popular?count=10
  // =====================================================

  getPopularNews(count: number = 10): Observable<PublicNews[]> {

    const params = new HttpParams()
      .set('count', count.toString());

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/popular`,
      { params }
    );
  }


  // =====================================================
  // NEWS BY CATEGORY
  // GET /api/publicnews/category/{categoryId}
  // =====================================================

  getNewsByCategory(
    categoryId: number
  ): Observable<PublicNews[]> {

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/category/${categoryId}`
    );
  }


  // =====================================================
  // NEWS BY SUBCATEGORY
  // GET /api/publicnews/subcategory/{subcategoryId}
  // =====================================================

  getNewsBySubcategory(
    subcategoryId: number
  ): Observable<PublicNews[]> {

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/subcategory/${subcategoryId}`
    );
  }


  // =====================================================
  // SEARCH NEWS
  // GET /api/publicnews/search?keyword=technology
  // =====================================================

  searchNews(
    keyword: string
  ): Observable<PublicNews[]> {

    const params = new HttpParams()
      .set('keyword', keyword.trim());

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/search`,
      { params }
    );
  }


  // =====================================================
  // NEWS DETAILS BY SLUG
  // GET /api/publicnews/{slug}
  // =====================================================

  getNewsBySlug(
    slug: string
  ): Observable<PublicNewsDetails> {

    return this.http.get<PublicNewsDetails>(
      `${this.apiUrl}/${encodeURIComponent(slug)}`
    );
  }
}