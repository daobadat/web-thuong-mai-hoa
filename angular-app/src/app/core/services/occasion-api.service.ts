import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface BackendOccasion {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OccasionListResponse {
  success: boolean;
  data: BackendOccasion[];
}

export interface OccasionDetailResponse {
  success: boolean;
  data: BackendOccasion;
}

@Injectable({ providedIn: 'root' })
export class OccasionApiService {
  constructor(private api: ApiService) {}

  getOccasions(): Observable<OccasionListResponse> {
    return this.api.get<OccasionListResponse>('/occasions');
  }

  getOccasion(id: number): Observable<OccasionDetailResponse> {
    return this.api.get<OccasionDetailResponse>(`/occasions/${id}`);
  }

  createOccasion(data: any): Observable<OccasionDetailResponse> {
    return this.api.post<OccasionDetailResponse>('/occasions', data);
  }

  updateOccasion(id: number, data: any): Observable<OccasionDetailResponse> {
    return this.api.put<OccasionDetailResponse>(`/occasions/${id}`, data);
  }

  deleteOccasion(id: number): Observable<any> {
    return this.api.delete(`/occasions/${id}`);
  }
}
