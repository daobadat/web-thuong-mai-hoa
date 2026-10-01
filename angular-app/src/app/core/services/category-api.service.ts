import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface BackendCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: BackendCategory[];
}

export interface CategoryDetailResponse {
  success: boolean;
  data: BackendCategory;
}

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  constructor(private api: ApiService) {}

  getCategories(): Observable<CategoryListResponse> {
    return this.api.get<CategoryListResponse>('/categories');
  }

  getCategory(id: number): Observable<CategoryDetailResponse> {
    return this.api.get<CategoryDetailResponse>(`/categories/${id}`);
  }

  createCategory(data: any): Observable<CategoryDetailResponse> {
    return this.api.post<CategoryDetailResponse>('/categories', data);
  }

  updateCategory(id: number, data: any): Observable<CategoryDetailResponse> {
    return this.api.put<CategoryDetailResponse>(`/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.api.delete(`/categories/${id}`);
  }
}
