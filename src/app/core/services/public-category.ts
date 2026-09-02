import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
}

@Injectable({
  providedIn: 'root',
})
export class PublicCategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/publiccategories';

  // =====================================================
  // GET ALL PUBLIC CATEGORIES
  // GET /api/publiccategories
  // =====================================================

  getCategories(): Observable<PublicCategory[]> {
    return this.http.get<PublicCategory[]>(this.apiUrl);
  }

  // =====================================================
  // GET PUBLIC CATEGORY BY SLUG
  // GET /api/publiccategories/{slug}
  // =====================================================

  getCategoryBySlug(slug: string): Observable<PublicCategory> {
    return this.http.get<PublicCategory>(`${this.apiUrl}/${encodeURIComponent(slug)}`);
  }
}
