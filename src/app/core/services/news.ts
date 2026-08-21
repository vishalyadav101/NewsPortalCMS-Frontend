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
  // =====================================================

  getAll(): Observable<News[]> {
    return this.getAllPaged('', undefined, undefined, undefined, '', 1, 1000).pipe(
      map((response) => response?.items ?? []),
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

    // -----------------------------------------------------
    // SEARCH
    // -----------------------------------------------------

    if (search.trim()) {
      params = params.set('Search', search.trim());
    }

    // -----------------------------------------------------
    // CATEGORY
    // -----------------------------------------------------

    if (categoryId !== undefined && categoryId !== null) {
      params = params.set('CategoryId', categoryId.toString());
    }

    // -----------------------------------------------------
    // PUBLISHED
    // -----------------------------------------------------

    if (isPublished !== undefined && isPublished !== null) {
      params = params.set('IsPublished', isPublished.toString());
    }

    // -----------------------------------------------------
    // FEATURED
    // -----------------------------------------------------

    if (isFeatured !== undefined && isFeatured !== null) {
      params = params.set('IsFeatured', isFeatured.toString());
    }

    // -----------------------------------------------------
    // SORT
    // -----------------------------------------------------

    if (sortBy.trim()) {
      params = params.set('SortBy', sortBy.trim());
    }

    console.log('News GET URL:', `${this.apiUrl}?${params.toString()}`);

    return this.http.get<NewsPagedResponse>(this.apiUrl, { params });
  }

  // =====================================================
  // GET BY ID
  // GET /api/News/{id}
  // =====================================================

  getById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  // =====================================================
  // CREATE NEWS
  // POST /api/News
  // =====================================================

  create(data: NewsRequest): Observable<News> {
    const formData = this.buildFormData(data);

    this.logFormData(formData);

    return this.http.post<News>(this.apiUrl, formData);
  }

  // =====================================================
  // UPDATE NEWS
  // PUT /api/News/{id}
  // =====================================================

  update(id: number, data: NewsRequest): Observable<News> {
    const formData = this.buildFormData(data);

    this.logFormData(formData);

    return this.http.put<News>(`${this.apiUrl}/${id}`, formData);
  }

  // =====================================================
  // DELETE NEWS
  // DELETE /api/News/{id}
  // =====================================================

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // =====================================================
  // BUILD FORM DATA
  // =====================================================

  private buildFormData(data: NewsRequest): FormData {
    const formData = new FormData();

    // ===================================================
    // BASIC INFORMATION
    // ===================================================

    formData.append('Title', data.title?.trim() ?? '');

    formData.append('Slug', data.slug?.trim() ?? '');

    formData.append('ShortDescription', data.shortDescription?.trim() ?? '');

    formData.append('Content', data.content ?? '');

    // ===================================================
    // FEATURED IMAGE
    // ===================================================

    if (data.featuredImage instanceof File) {
      formData.append('FeaturedImage', data.featuredImage, data.featuredImage.name);
    }

    // ===================================================
    // FEATURED VIDEO
    // ===================================================

    if (data.featuredVideo instanceof File) {
      formData.append('FeaturedVideo', data.featuredVideo, data.featuredVideo.name);
    }

    // ===================================================
    // AUTHOR
    // ===================================================

    formData.append('Author', data.author?.trim() ?? '');

    // ===================================================
    // PUBLISH DATE
    // ===================================================

    if (data.publishDate) {
      const publishDate = new Date(data.publishDate);

      if (!isNaN(publishDate.getTime())) {
        formData.append('PublishDate', publishDate.toISOString());
      }
    }

    // ===================================================
    // IS PUBLISHED
    // ===================================================

    formData.append('IsPublished', String(data.isPublished === true));

    // ===================================================
    // IS FEATURED
    // ===================================================

    formData.append('IsFeatured', String(data.isFeatured === true));

    // ===================================================
    // CATEGORY ID
    // ===================================================

    formData.append('CategoryId', String(data.categoryId));

    // ===================================================
    // SUB CATEGORY ID
    // ===================================================

    // 0 ka matlab no sub-category selected.
    // Isliye 0 backend ko nahi bhejenge.

    if (data.subCategoryId !== undefined && data.subCategoryId !== null && data.subCategoryId > 0) {
      formData.append('SubCategoryId', String(data.subCategoryId));
    }

    return formData;
  }

  // =====================================================
  // DEBUG FORM DATA
  // =====================================================

  private logFormData(formData: FormData): void {
    console.log('========== NEWS FORM DATA ==========');

    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          type: value.type,
          size: value.size,
        });
      } else {
        console.log(`${key}:`, value);
      }
    });

    console.log('====================================');
  }
}
