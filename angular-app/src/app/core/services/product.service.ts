import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models';
import { ProductApiService, BackendProduct } from './product-api.service';
import { OccasionApiService } from './occasion-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public products = signal<Product[]>([]);
  public selectedCategory = signal<string>('all');
  public selectedOccasion = signal<string | 'sale' | 'all'>('all');
  public searchQuery = signal<string>('');
  
  public occasionsList = signal<any[]>([]);
  public occasionKeys = computed(() => this.occasionsList().map(o => o.slug));

  // Danh sách slug danh mục từ DB (dynamic)
  public readonly CATEGORY_SLUGS = ['bo-hoa', 'hop-hoa', 'gio-hoa', 'ke-hoa'];
  public readonly CATEGORY_NAMES: Record<string, { vi: string; ko: string }> = {
    'bo-hoa':  { vi: 'Bó hoa',  ko: '꽃다발' },
    'hop-hoa': { vi: 'Hộp hoa', ko: '플라워 박스' },
    'gio-hoa': { vi: 'Giỏ hoa', ko: '꽃바구니' },
    'ke-hoa':  { vi: 'Kệ hoa',  ko: '화환' },
  };

  public priceFilters = signal<string[]>([]);
  public colorFilter = signal<string | null>(null);
  public sortOption = signal<'popular' | 'rating' | 'new' | 'price-asc' | 'price-desc'>('popular');

  public PRICE_RANGES = [
    { key: 'low', label: 'Dưới 500.000đ', test: (p: Product) => p.price < 500000 },
    { key: 'mid', label: '500.000đ – 800.000đ', test: (p: Product) => p.price >= 500000 && p.price <= 800000 },
    { key: 'high', label: 'Trên 800.000đ', test: (p: Product) => p.price > 800000 }
  ];

  constructor(
    private productApi: ProductApiService,
    private occasionApi: OccasionApiService
  ) {
    this.loadProducts();
    this.loadOccasions();
  }

  loadOccasions() {
    this.occasionApi.getOccasions().subscribe({
      next: (res: any) => {
        this.occasionsList.set(res.data || []);
      }
    });
  }

  loadProducts() {
    this.productApi.getProducts({ limit: 100 }).subscribe({
      next: (res) => {
        const backendProducts = res.data?.products || [];
        const mappedProducts: Product[] = backendProducts.map(p => this.mapBackendProduct(p));
        this.products.set(mappedProducts);
      }
    });
  }

  private mapBackendProduct(p: BackendProduct): Product {
    const vi = p.translations?.find(t => t.language_code === 'vi');
    const ko = p.translations?.find(t => t.language_code === 'ko');

    return {
      id: p.id.toString(),
      nameVi: vi?.name || p.sku,
      nameKo: ko?.name || '',
      price: Number(p.base_price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      occasions: p.occasions ? p.occasions.map(o => o.slug).filter(Boolean) : [],
      category: p.category?.slug || '',  // Lưu slug gốc từ DB
      img: p.images && p.images.length > 0 ? p.images[0].url : 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=500&h=620&fit=crop&auto=format',
      descVi: vi?.description || '',
      descKo: ko?.description || '',
      meaningVi: vi?.flower_meaning || '',
      meaningKo: ko?.flower_meaning || '',
      isPopular: Number(p.avg_rating || 0) > 4.5 || Math.random() > 0.7,
      isNew: Math.random() > 0.8,
      stock: p.stock_quantity,
    };
  }

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
      list = list.filter(p => p.occasions.includes(occ));
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

  public getOccasionName(slug: string, lang: string) {
    const occ = this.occasionsList().find(o => o.slug === slug);
    if (!occ) return slug;
    const translation = occ.translations?.find((t: any) => t.language_code === lang);
    return translation ? translation.name : (occ.name || slug);
  }

  public getOccasionDesc(slug: string, lang: string) {
    const occ = this.occasionsList().find(o => o.slug === slug);
    if (!occ) return [];
    const translation = occ.translations?.find((t: any) => t.language_code === lang);
    return translation?.description ? [translation.description] : [];
  }

  public getOccasionIcon(slug: string) {
    const icons: any = {
      'valentine': '💝',
      'quoc-te-phu-nu': '👩',
      'phu-nu-viet-nam': '👩',
      'chuseok': '🍂',
      'sinh-nhat': '🎂',
      'khai-truong': '🎋',
      'cuoi-hoi': '💍',
      'doanh-nghiep': '💼'
    };
    return icons[slug] || '🌸';
  }

  public getCategoryName(slug: string, lang: string): string {
    return this.CATEGORY_NAMES[slug]?.[lang as 'vi' | 'ko'] || slug;
  }
}
