import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SuggestItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  is_in_stock: boolean;
  image: string;
}

export interface SuggestResponse {
  success: boolean;
  data: SuggestItem[];
}

@Injectable({ providedIn: 'root' })
export class SearchSuggestService {
  constructor(private api: ApiService) {}

  suggest(keyword: string, lang: string = 'vi', limit: number = 8): Observable<SuggestResponse> {
    return this.api.get<SuggestResponse>('/products/suggest', { keyword, lang, limit });
  }
}
