import { Injectable, signal, computed } from '@angular/core';
import { Product, OccasionKey } from '../models';
import { PRODUCTS, OCC_INFO, OCC_ICONS } from '../data/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public products = signal<Product[]>(PRODUCTS);
  public selectedCategory = signal<string>('all');
  public selectedOccasion = signal<OccasionKey | 'sale' | 'all'>('all');
  public searchQuery = signal<string>('');

  public filteredProducts = computed(() => {
    let list = this.products();

    const cat = this.selectedCategory();
    if (cat !== 'all') {
      list = list.filter(p => p.category === cat);
    }

    const occ = this.selectedOccasion();
    if (occ === 'sale') {
      list = list.filter(p => !!p.originalPrice);
    } else if (occ !== 'all') {
      list = list.filter(p => p.occasions.includes(occ as OccasionKey));
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(p =>
        p.nameVi.toLowerCase().includes(query) ||
        p.nameKo.toLowerCase().includes(query) ||
        p.descVi.toLowerCase().includes(query) ||
        p.descKo.toLowerCase().includes(query)
      );
    }

    return list;
  });

  public getOccasionInfo(key: OccasionKey | 'sale') {
    return OCC_INFO[key];
  }

  public getOccasionIcon(key: OccasionKey) {
    return OCC_ICONS[key];
  }
}
