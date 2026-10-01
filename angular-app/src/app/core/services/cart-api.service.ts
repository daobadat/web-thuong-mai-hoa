import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL, ApiService } from './api.service';

export interface BackendCartItem {
  id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  unit_price_snapshot: number;
  note?: string;
  product?: any;
  variant?: any;
}

export interface BackendCart {
  id: number;
  session_id?: string;
  user_id?: number;
  items: BackendCartItem[];
  total_items: number;
  subtotal: number;
}

export interface CartResponse {
  success: boolean;
  data: BackendCart;
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private sessionId: string;

  constructor(private api: ApiService, private http: HttpClient) {
    let sid = localStorage.getItem('cart_session_id');
    if (!sid) {
      // generate a unique session id
      sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('cart_session_id', sid);
    }
    this.sessionId = sid;
  }

  private getCartHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.api.accessToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      headers = headers.set('x-session-id', this.sessionId);
    }
    return headers;
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${API_BASE_URL}/cart`, { headers: this.getCartHeaders() });
  }

  addToCart(product_id: number, quantity: number = 1, variant_id?: number, note?: string): Observable<CartResponse> {
    const body: any = { product_id, quantity };
    if (variant_id) body.variant_id = variant_id;
    if (note) body.note = note;
    return this.http.post<CartResponse>(`${API_BASE_URL}/cart/add`, body, { headers: this.getCartHeaders() });
  }

  updateItem(itemId: number, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${API_BASE_URL}/cart/items/${itemId}`, { quantity }, { headers: this.getCartHeaders() });
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/cart/items/${itemId}`, { headers: this.getCartHeaders() });
  }
}
