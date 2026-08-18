import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { News, NewsRequest, NewsPagedResponse } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/News';

  // =====================================================
  // GET ALL NEWS
  // Existing components ke liye
  // Returns News[]
  // =====================================================

  getAll(): Observable<News[]> {
    return this.getAllPaged('', undefined, undefined, undefined, '', 1, 1000).pipe(
      map((response) => response.items),
    );
  }

  // =====================================================
  // GET PAGED NEWS
  // GET /api/News
  // =====================================================

  getAllPaged(
    search: string = '',
    categoryId?: number,
    isPublished?: boolean,
    isFeatured?: boolean,
    sortBy: string = '',
    pageNumber: number = 1,
    pageSize: number = 12,
  ): Observable<NewsPagedResponse> {
    let params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    if (search.trim()) {
      params = params.set('Search', search.trim());
    }

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('CategoryId', categoryId.toString());
    }

    if (isPublished !== undefined && isPublished !== null) {
      params = params.set('IsPublished', isPublished.toString());
    }

    if (isFeatured !== undefined && isFeatured !== null) {
      params = params.set('IsFeatured', isFeatured.toString());
    }

    if (sortBy.trim()) {
      params = params.set('SortBy', sortBy.trim());
    }

    return this.http.get<NewsPagedResponse>(this.apiUrl, { params });
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  getById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  // =====================================================
  // CREATE
  // =====================================================

  create(data: NewsRequest): Observable<News> {
    const formData = this.buildFormData(data);

    return this.http.post<News>(this.apiUrl, formData);
  }

  // =====================================================
  // UPDATE
  // =====================================================

  update(id: number, data: NewsRequest): Observable<any> {
    const formData = this.buildFormData(data);

    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // =====================================================
  // DELETE
  // =====================================================

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // =====================================================
  // FORM DATA
  // =====================================================

  private buildFormData(data: NewsRequest): FormData {
    const formData = new FormData();

    formData.append('title', data.title);

    formData.append('slug', data.slug);

    formData.append('shortDescription', data.shortDescription);

    formData.append('content', data.content);

    if (data.featuredImage) {
      formData.append('featuredImage', data.featuredImage);
    }

    if (data.featuredVideo) {
      formData.append('featuredVideo', data.featuredVideo);
    }

    formData.append('author', data.author);

    formData.append('publishDate', data.publishDate);

    formData.append('isPublished', String(data.isPublished));

    formData.append('isFeatured', String(data.isFeatured));

    formData.append('categoryId', String(data.categoryId));

    return formData;
  }
}
