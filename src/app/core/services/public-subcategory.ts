import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicSubcategory {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicSubcategoryService {

  private readonly http = inject(HttpClient);

  // IMPORTANT:
  // This must match your actual Swagger endpoint
  private readonly apiUrl =
    'https://localhost:7103/api/public/subcategories';

  // =========================================================
  // GET ALL SUBCATEGORIES
  // =========================================================

  getSubcategories(): Observable<PublicSubcategory[]> {

    return this.http.get<PublicSubcategory[]>(
      this.apiUrl
    );

  }

  // =========================================================
  // GET SUBCATEGORIES BY CATEGORY
  // =========================================================

  getSubcategoriesByCategory(
    categoryId: number
  ): Observable<PublicSubcategory[]> {

    return this.http.get<PublicSubcategory[]>(
      `${this.apiUrl}/category/${categoryId}`
    );

  }
}