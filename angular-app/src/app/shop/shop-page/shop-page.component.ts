import { Component, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.css'],
  standalone: false
})
export class ShopPageComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);

  get occasions(): string[] {
    return this.productService.occasionKeys();
  }
  
  filterOpen = false;
  pageSize = 12;
  currentPage = 1;

  COLORS = [
    { key: 'pink', label: 'Hồng', labelKo: '핑크', hex: '#F4B8CC' },
    { key: 'red', label: 'Đỏ', labelKo: '빨강', hex: '#C0392B' },
    { key: 'white', label: 'Trắng', labelKo: '흰색', hex: '#F5F5F5' },
    { key: 'yellow', label: 'Vàng', labelKo: '노랑', hex: '#F7C948' },
    { key: 'purple', label: 'Tím', labelKo: '보라', hex: '#9B59B6' },
    { key: 'mixed', label: 'Mix màu', labelKo: '혼합', hex: 'linear-gradient(135deg,#F4B8CC,#F7C948,#9B59B6)' },
  ];

  get displayedProducts() {
    const list = this.productService.filteredProducts();
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.productService.filteredProducts().length / this.pageSize);
  }

  get hasActiveFilters() {
    return this.productService.priceFilters().length > 0 || 
           this.productService.colorFilter() !== null || 
           this.productService.selectedCategory() !== 'all';
  }

  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setOccasion(occ: any) {
    this.productService.selectedOccasion.set(occ);
    this.currentPage = 1;
  }

  setCategory(cat: any) {
    this.productService.selectedCategory.set(cat);
    this.currentPage = 1;
  }

  togglePrice(key: string) {
    const current = this.productService.priceFilters();
    if (current.includes(key)) {
      this.productService.priceFilters.set(current.filter(k => k !== key));
    } else {
      this.productService.priceFilters.set([...current, key]);
    }
    this.currentPage = 1;
  }

  setColor(key: string) {
    if (this.productService.colorFilter() === key) {
      this.productService.colorFilter.set(null);
    } else {
      this.productService.colorFilter.set(key);
    }
    this.currentPage = 1;
  }

  changeSort(event: Event) {
    const val = (event.target as HTMLSelectElement).value as any;
    this.productService.sortOption.set(val);
    this.currentPage = 1;
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  goPage(p: number) {
    this.currentPage = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters() {
    this.productService.selectedCategory.set('all');
    this.productService.selectedOccasion.set('all');
    this.productService.priceFilters.set([]);
    this.productService.colorFilter.set(null);
    this.productService.searchQuery.set('');
    this.currentPage = 1;
  }

  getOccasionTitle(k: string) {
    return this.productService.getOccasionName(k, this.langService.currentLang());
  }

  getCategoryName(slug: string) {
    return this.productService.getCategoryName(slug, this.langService.currentLang());
  }
}
