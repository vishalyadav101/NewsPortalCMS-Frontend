
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  PublicNews,
  PublicNewsDetails,
} from '../models/public-news.model';

@Injectable({
  providedIn: 'root',
})
export class PublicNewsService {
  private readonly http = inject(HttpClient);

  // =====================================================
  // PUBLIC NEWS API URL
  // =====================================================

  private readonly apiUrl =
    'https://localhost:7103/api/publicnews';

  // =====================================================
  // GET LATEST NEWS
  // GET /api/publicnews/latest?count=10
  // =====================================================

  getLatestNews(count: number = 10): Observable<PublicNews[]> {
    const params = new HttpParams().set(
      'count',
      count.toString()
    );

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/latest`,
      { params }
    );
  }

  // =====================================================
  // GET FEATURED NEWS
  // GET /api/publicnews/featured?count=10
  // =====================================================

  getFeaturedNews(count: number = 10): Observable<PublicNews[]> {
    const params = new HttpParams().set(
      'count',
      count.toString()
    );

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/featured`,
      { params }
    );
  }

  // =====================================================
  // GET POPULAR NEWS
  // GET /api/publicnews/popular?count=10
  // =====================================================

  getPopularNews(count: number = 10): Observable<PublicNews[]> {
    const params = new HttpParams().set(
      'count',
      count.toString()
    );

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/popular`,
      { params }
    );
  }

  // =====================================================
  // GET NEWS BY CATEGORY
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
  // GET NEWS BY SUBCATEGORY
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
  // GET /api/publicnews/search?keyword=...
  // =====================================================

  searchNews(
    keyword: string
  ): Observable<PublicNews[]> {
    const params = new HttpParams().set(
      'keyword',
      keyword.trim()
    );

    return this.http.get<PublicNews[]>(
      `${this.apiUrl}/search`,
      { params }
    );
  }

  // =====================================================
  // GET NEWS DETAILS BY SLUG
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