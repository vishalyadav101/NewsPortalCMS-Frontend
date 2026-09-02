import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicSubCategory {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
}

@Injectable({
  providedIn: 'root',
})
export class PublicSubCategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/publicsubcategories';

  // =====================================================
  // GET SUBCATEGORIES BY CATEGORY
  // GET /api/publicsubcategories/category/{categoryId}
  // =====================================================

  getSubCategoriesByCategory(categoryId: number): Observable<PublicSubCategory[]> {
    return this.http.get<PublicSubCategory[]>(`${this.apiUrl}/category/${categoryId}`);
  }
}
