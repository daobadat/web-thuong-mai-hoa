import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserAddress {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
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

  getAddresses(): Observable<UserAddressListResponse> {
    return this.api.get<UserAddressListResponse>('/user/addresses');
  }

  addAddress(data: any): Observable<{ success: boolean; data: UserAddress }> {
    return this.api.post<{ success: boolean; data: UserAddress }>('/user/addresses', data);
  }

  deleteAddress(id: number): Observable<any> {
    return this.api.delete(`/user/addresses/${id}`);
  }
}
