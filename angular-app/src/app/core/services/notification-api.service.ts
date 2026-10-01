import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface BackendNotification {
  id: number;
  user_id: number;
  title: string;
  content: string;
  type?: string;
  is_read: boolean;
  created_at?: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: BackendNotification[];
}

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  constructor(private api: ApiService) {}

  getNotifications(): Observable<NotificationListResponse> {
    return this.api.get<NotificationListResponse>('/notifications');
  }

  markAllAsRead(): Observable<any> {
    return this.api.put('/notifications/read-all', {});
  }

  markAsRead(id: number): Observable<any> {
    return this.api.put(`/notifications/${id}/read`, {});
  }

  deleteNotification(id: number): Observable<any> {
    return this.api.delete(`/notifications/${id}`);
  }
}
