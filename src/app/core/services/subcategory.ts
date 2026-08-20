import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SubCategory, SubCategoryRequest } from '../models/subcategory.model';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/SubCategory';

  // ==========================================
  // GET ALL SUB CATEGORIES
  // ==========================================

  getAll(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.apiUrl);
  }

  // ==========================================
  // GET SUB CATEGORY BY ID
  // ==========================================

  getById(id: number): Observable<SubCategory> {
    return this.http.get<SubCategory>(`${this.apiUrl}/${id}`);
  }

  // ==========================================
  // CREATE SUB CATEGORY
  // ==========================================

  create(data: SubCategoryRequest): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.apiUrl, data);
  }

  // ==========================================
  // UPDATE SUB CATEGORY
  // ==========================================

  update(id: number, data: SubCategoryRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ==========================================
  // DELETE SUB CATEGORY
  // ==========================================

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
