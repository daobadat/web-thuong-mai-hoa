import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BackendProduct } from './product-api.service';

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at?: string;
  product?: BackendProduct;
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
}

@Injectable({ providedIn: 'root' })
export class WishlistApiService {
  constructor(private api: ApiService) {}

  getWishlist(): Observable<WishlistResponse> {
    return this.api.get<WishlistResponse>('/wishlist');
  }

  addToWishlist(productId: number): Observable<any> {
    return this.api.post(`/wishlist/${productId}`, {});
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.api.delete(`/wishlist/${productId}`);
  }
}
