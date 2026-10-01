import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DeliverySlot {
  id: number;
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  label?: string;
}

export interface DeliverySlotListResponse {
  success: boolean;
  data: DeliverySlot[];
}

@Injectable({ providedIn: 'root' })
export class DeliverySlotApiService {
  constructor(private api: ApiService) {}

  getDeliverySlots(): Observable<DeliverySlotListResponse> {
    return this.api.get<DeliverySlotListResponse>('/delivery-slots');
  }
}
