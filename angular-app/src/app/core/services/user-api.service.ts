import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserAddress {
  id: number;
  user_id: number;
  recipient_name: string;
  recipient_phone: string;
  address_line: string;
  ward?: string;
  district: string;
  city: string;
  is_default: boolean;
}

export interface UserAddressListResponse {
  success: boolean;
  data: UserAddress[];
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private api: ApiService) {}

  updateProfile(data: any): Observable<any> {
    return this.api.put('/user/profile', data);
  }

  changePassword(data: any): Observable<any> {
    return this.api.put('/user/change-password', data);
  }

  getAddresses(): Observable<UserAddressListResponse> {
    return this.api.get<UserAddressListResponse>('/user/addresses');
  }

  addAddress(data: any): Observable<{ success: boolean; data: UserAddress }> {
    return this.api.post<{ success: boolean; data: UserAddress }>('/user/addresses', data);
  }

  updateAddress(id: number, data: any): Observable<{ success: boolean; data: UserAddress }> {
    return this.api.put<{ success: boolean; data: UserAddress }>(`/user/addresses/${id}`, data);
  }

  deleteAddress(id: number): Observable<any> {
    return this.api.delete(`/user/addresses/${id}`);
  }

  // --- Admin User Management ---
  getUsers(params?: any): Observable<any> {
    return this.api.get('/users', params);
  }

  getUser(id: number): Observable<any> {
    return this.api.get(`/users/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.api.post('/users', data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.api.put(`/users/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.api.delete(`/users/${id}`);
  }
}
