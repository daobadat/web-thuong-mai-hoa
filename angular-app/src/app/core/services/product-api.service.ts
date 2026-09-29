import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface BackendProduct {
  id: number;
  sku: string;
  base_price: number;
  original_price?: number;
  stock_quantity: number;
  avg_rating?: number;
  is_preorder?: boolean;
  is_active?: boolean;
  category_id?: number;
  category?: { id: number; slug: string };
  translations?: Array<{
    language_code: string;
    name: string;
    description?: string;
    care_instructions?: string;
    flower_meaning?: string;
  }>;
  images?: Array<{
    url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  variants?: Array<{
    id: number;
    variant_name: string;
    price_adjustment: number;
    stock_quantity: number;
  }>;
  occasions?: Array<{ id: number; slug: string }>;
  created_at: string;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    products: BackendProduct[];
  };
}

export interface ProductDetailResponse {
  success: boolean;
  data: BackendProduct;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  lang?: string;
  category_id?: number;
  occasion_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  constructor(private api: ApiService) {}

  getProducts(params: ProductQueryParams = {}): Observable<ProductListResponse> {
    return this.api.get<ProductListResponse>('/products', params as Record<string, any>);
  }

  getProduct(id: number, lang: string = 'vi'): Observable<ProductDetailResponse> {
    return this.api.get<ProductDetailResponse>(`/products/${id}`, { lang });
  }

  createProduct(data: any): Observable<ProductDetailResponse> {
    return this.api.post<ProductDetailResponse>('/products', data);
  }

  updateProduct(id: number, data: any): Observable<ProductDetailResponse> {
    return this.api.put<ProductDetailResponse>(`/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.delete(`/products/${id}`);
  }
}
