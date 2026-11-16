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

  public readonly OCCASION_NAMES: Record<string, {
    vi: string;
    ko: string;
    shortVi: string;
    shortKo: string;
    descVi: string;
    descKo: string;
  }> = {
    'valentine': {
      vi: 'Lễ Tình Nhân (Valentine 14/2)',
      ko: '발렌타인데이',
      shortVi: 'Valentine',
      shortKo: '발렌타인데이',
      descVi: 'Hoa hồng đỏ lãng mạn bày tỏ tình yêu sâu sắc.',
      descKo: '사랑을 전하는 로맨틱 장미 꽃다발 컬렉션입니다.'
    },
    'quoc-te-phu-nu': {
      vi: 'Quốc Tế Phụ Nữ 8/3',
      ko: '세계 여성의 날',
      shortVi: 'Quốc Tế Phụ Nữ',
      shortKo: '세계 여성의 날',
      descVi: 'Tôn vinh và tri ân những người phụ nữ tuyệt vời.',
      descKo: '여성의 날을 축하하는 아름다운 꽃선물 컬렉션입니다.'
    },
    'phu-nu-viet-nam': {
      vi: 'Ngày Phụ Nữ Việt Nam 20/10',
      ko: '베트남 여성의 날',
      shortVi: 'Phụ Nữ VN',
      shortKo: '베트남 여성의 날',
      descVi: 'Gửi trọn yêu thương đến người phụ nữ Việt Nam.',
      descKo: '베트남 여성의 날을 기념하는 특별한 꽃선물입니다.'
    },
    'chuseok': {
      vi: 'Tết Trung Thu (Chuseok)',
      ko: '추석 명절',
      shortVi: 'Trung Thu',
      shortKo: '추석 명절',
      descVi: 'Quà hoa và giỏ trái cây biếu gia đình mùa trung thu.',
      descKo: '풍성한 한가위 마음을 담은 고급 꽃바구니 컬렉션입니다.'
    },
    'sinh-nhat': {
      vi: 'Kỷ Niệm Sinh Nhật',
      ko: '생일 축하',
      shortVi: 'Sinh Nhật',
      shortKo: '생일 축하',
      descVi: 'Hoa tươi vui tươi mừng tuổi mới.',
      descKo: '특별한 생일을 축하하는 화사한 꽃선물입니다.'
    },
    'khai-truong': {
      vi: 'Chúc Mừng Khai Trương',
      ko: '개업 축하',
      shortVi: 'Khai Trương',
      shortKo: '개업 축하',
      descVi: 'Hoa chúc mừng khai trương, hồng phát.',
      descKo: '성공과 번영을 기원하는 품격 있는 개업 축하 화환입니다.'
    },
    'cuoi-hoi': {
      vi: 'Cưới Hỏi & Kỷ Niệm',
      ko: '결혼 / 웨딩',
      shortVi: 'Cưới Hỏi',
      shortKo: '결혼 / 웨딩',
      descVi: 'Hoa cầm tay cô dâu và trang trí tiệc cưới sang trọng.',
      descKo: '로맨틱한 신부 부케와 웨딩 꽃장식 컬렉션입니다.'
    },
    'doanh-nghiep': {
      vi: 'Quà Doanh Nghiệp',
      ko: '기업 선물',
      shortVi: 'Doanh Nghiệp',
      shortKo: '기업 선물',
      descVi: 'Hoa và quà tặng sang trọng cho đối tác, khách hàng doanh nghiệp.',
      descKo: '비즈니스 파트너와 고객을 위한 격조 높은 기업 선물입니다.'
    },
    'sale': {
      vi: 'Đang Giảm Giá',
      ko: '할인 상품',
      shortVi: 'Giảm Giá',
      shortKo: '할인 상품',
      descVi: 'Khám phá các mẫu hoa tươi nghệ thuật đang có ưu đãi giảm giá tốt nhất hôm nay.',
      descKo: '특별 할인 혜택이 적용된 프리미엄 생화 컬렉션입니다.'
    }
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
      isNew: p.created_at ? (Date.now() - new Date(p.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000 : false,
      createdAt: p.created_at ? new Date(p.created_at).getTime() : 0,
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
      list = list.filter(p => !!p.originalPrice && p.originalPrice > p.price);
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

  public getOccasionName(slug: string, lang: string): string {
    const key = (slug || '').toLowerCase().trim();
    if (key === 'sale') {
      return lang === 'ko' ? '할인 상품' : 'Đang Giảm Giá';
    }
    const occ = this.occasionsList().find(o => o.slug === slug || o.slug === key);
    const translation = occ?.translations?.find((t: any) => t.language_code === lang);
    if (translation?.name && !/^[a-z0-9_-]+$/i.test(translation.name)) {
      return translation.name;
    }
    const dict = this.OCCASION_NAMES[key];
    if (dict) {
      return lang === 'ko' ? dict.ko : dict.vi;
    }
    return occ?.name || slug;
  }

  public getOccasionDesc(slug: string, lang: string): string[] {
    const key = (slug || '').toLowerCase().trim();
    if (key === 'sale') {
      return lang === 'ko'
        ? ['특별 할인 혜택이 적용된 프리미엄 생화 컬렉션입니다. 2~4시간 내 신속 당일 배송!']
        : ['Khám phá các mẫu hoa tươi nghệ thuật đang có ưu đãi giảm giá tốt nhất hôm nay. Đặt hoa nhanh, giao tận tay người thương trong 2-4 giờ!'];
    }
    const occ = this.occasionsList().find(o => o.slug === slug || o.slug === key);
    const translation = occ?.translations?.find((t: any) => t.language_code === lang);
    if (translation?.description) {
      return [translation.description];
    }
    const dict = this.OCCASION_NAMES[key];
    if (dict) {
      return [lang === 'ko' ? dict.descKo : dict.descVi];
    }
    return [];
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
