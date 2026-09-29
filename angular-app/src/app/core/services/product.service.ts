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

  public priceFilters = signal<string[]>([]);
  public colorFilter = signal<string | null>(null);
  public sortOption = signal<'popular' | 'rating' | 'new' | 'price-asc' | 'price-desc'>('popular');

  public PRICE_RANGES = [
    { key: 'low', label: 'Dưới 500.000đ', test: (p: Product) => p.price < 500000 },
    { key: 'mid', label: '500.000đ – 800.000đ', test: (p: Product) => p.price >= 500000 && p.price <= 800000 },
    { key: 'high', label: 'Trên 800.000đ', test: (p: Product) => p.price > 800000 }
  ];

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

    const activePrices = this.priceFilters();
    if (activePrices.length > 0) {
      list = list.filter(p => this.PRICE_RANGES.some(r => activePrices.includes(r.key) && r.test(p)));
    }

    // Color filter placeholder (if products had colors)
    // const color = this.colorFilter();
    // if (color) list = list.filter(p => p.color === color);

    const sort = this.sortOption();
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sort === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      if (sort === 'rating') return b.stock - a.stock;
      return 0;
    });

    return list;
  });

  public getOccasionInfo(key: OccasionKey | 'sale' | 'all') {
    if (key === 'all') return null;
    return OCC_INFO[key];
  }

  public getOccasionIcon(key: OccasionKey) {
    return OCC_ICONS[key];
  }
}
