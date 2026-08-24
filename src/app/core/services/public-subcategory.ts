import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicSubcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PublicSubcategoryService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7103/api/publicsubcategories';

  getSubcategories(): Observable<PublicSubcategory[]> {
    return this.http.get<PublicSubcategory[]>(this.apiUrl);
  }

  getSubcategoriesByCategory(
    categoryId: number
  ): Observable<PublicSubcategory[]> {

    return this.http.get<PublicSubcategory[]>(
      `${this.apiUrl}/category/${categoryId}`
    );
  }
}