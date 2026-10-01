import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { OccasionKey, Product } from '../../core/models';
import { OCC, OCCASION_KEYS, OCC_ICONS } from '../../core/data/products';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  standalone: false
})
export class HomePageComponent implements OnInit, OnDestroy {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);
  router = inject(Router);

  occasionKeys = OCCASION_KEYS;

  // Hero carousel state
  currentSlideIdx = 0;
  private timerRef: any = null;

  // Promo tiles
  get promos() {
    const vi = this.langService.currentLang() === 'vi';
    return [
      {
        label: vi ? 'Hoa Sinh Nhật' : '생일 꽃',
        sub: vi ? 'Giao trong ngày' : '당일 배달',
        color: 'from-[#D9A6A0] to-[#C07E78]',
        img: 'https://placehold.co/320x320/D9A6A0/FFF?text=Hoa+Sinh+Nhat',
        key: 'birthday' as OccasionKey | 'sale',
      },
      {
        label: vi ? 'Hoa Khai Trương' : '개업 꽃',
        sub: vi ? 'Kệ hoa lớn' : '대형 화환',
        color: 'from-[#5F6F52] to-[#3D4D33]',
        img: 'https://placehold.co/320x320/5F6F52/FFF?text=Hoa+Khai+Truong',
        key: 'opening' as OccasionKey | 'sale',
      },
      {
        label: vi ? 'SALE -30%' : '세일 -30%',
        sub: vi ? 'Hoa đặc biệt' : '특별 할인',
        color: 'from-[#6E2A34] to-[#4A1A22]',
        img: 'https://placehold.co/320x320/6E2A34/FFF?text=Sale',
        key: 'sale' as OccasionKey | 'sale',
      },
      {
        label: vi ? 'Hoa Cưới Hỏi' : '결혼 꽃',
        sub: vi ? 'Sang trọng · Tinh tế' : '우아하고 세련된',
        color: 'from-[#E4D9C8] to-[#C9B9A2]',
        img: 'https://placehold.co/320x320/E4D9C8/6E2A34?text=Hoa+Cuoi+Hoi',
        key: 'wedding' as OccasionKey | 'sale',
      },
    ];
  }

  get slides() {
    return this.langService.t.heroSlides;
  }

  get currentSlide() {
    return this.slides[this.currentSlideIdx];
  }

  get saleProducts() {
    return this.productService.products().filter(p => !!p.originalPrice);
  }

  get popularProducts() {
    return this.productService.products().filter(p => p.isPopular);
  }

  get newProducts() {
    return this.productService.products().filter(p => p.isNew);
  }

  get occasionSections() {
    return OCCASION_KEYS.map((k, i) => ({
      key: k,
      title: OCC[k][this.langService.currentLang()],
      sub: this.langService.currentLang() === 'vi'
        ? `— Dành cho dịp ${OCC[k].vi.toLowerCase()}`
        : `— ${OCC[k].ko} 선물`,
      products: this.productService.products().filter(p => p.occasions.includes(k)),
      bgClass: i % 2 === 0 ? 'bg-[#F4EDE3]' : 'bg-[#FBF6EF]',
    }));
  }

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.timerRef = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoSlide() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  nextSlide() {
    this.currentSlideIdx = (this.currentSlideIdx + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlideIdx = (this.currentSlideIdx - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlideIdx = index;
    this.resetAutoSlide();
  }

  onPrev() {
    this.prevSlide();
    this.resetAutoSlide();
  }

  onNext() {
    this.nextSlide();
    this.resetAutoSlide();
  }

  filterOccasion(key: OccasionKey | 'sale') {
    this.productService.selectedOccasion.set(key);
    this.router.navigate(['/shop']);
  }

  getOccasionLabel(key: OccasionKey) {
    return OCC[key] ? OCC[key][this.langService.currentLang()] : key;
  }

  getOccasionIcon(key: OccasionKey) {
    return OCC_ICONS[key] || '🌸';
  }

  discountPct(p: Product): number {
    return p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('vi-VN').format(n);
  }

  getProductName(p: Product): string {
    return this.langService.currentLang() === 'ko' ? p.nameKo : p.nameVi;
  }
}
