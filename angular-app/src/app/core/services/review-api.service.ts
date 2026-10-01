import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthUser } from './auth-api.service';

export interface BackendReview {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at?: string;
  user?: AuthUser;
}

export interface ReviewListResponse {
  success: boolean;
  data: BackendReview[];
}

export interface ReviewCreateRequest {
  product_id: number;
  rating: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  constructor(private api: ApiService) {}

  getProductReviews(productId: number): Observable<ReviewListResponse> {
    return this.api.get<ReviewListResponse>(`/products/${productId}/reviews`);
  }

  createReview(data: ReviewCreateRequest): Observable<{ success: boolean; data: BackendReview }> {
    return this.api.post<{ success: boolean; data: BackendReview }>('/reviews', data);
  }

  deleteReview(id: number): Observable<any> {
    return this.api.delete(`/reviews/${id}`);
  }
}
