import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { News, NewsRequest } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7103/api/News';

  getAll(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  getById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  create(data: NewsRequest): Observable<News> {
    const formData = this.buildFormData(data);

    return this.http.post<News>(this.apiUrl, formData);
  }

  update(id: number, data: NewsRequest): Observable<any> {
    const formData = this.buildFormData(data);

    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private buildFormData(data: NewsRequest): FormData {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('shortDescription', data.shortDescription);
    formData.append('content', data.content);

    // Image
    if (data.featuredImage) {
      formData.append('featuredImage', data.featuredImage);
    }

    // Video
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