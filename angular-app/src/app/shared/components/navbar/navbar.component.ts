import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../../../core/services/lang.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { OccasionKey } from '../../../core/models';
import { OCC, OCCASION_KEYS, OCC_ICONS } from '../../../core/data/products';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);
  router = inject(Router);

  menuOpen = false;
  userOpen = false;
  searchVal = '';

  occasionKeys = OCCASION_KEYS;

  toggleLang() {
    const nextLang = this.langService.currentLang() === 'vi' ? 'ko' : 'vi';
    this.langService.setLang(nextLang);
  }

  getOccasionName(key: OccasionKey): string {
    const lang = this.langService.currentLang();
    return OCC[key] ? OCC[key][lang] : key;
  }

  getOccasionIcon(key: OccasionKey): string {
    return OCC_ICONS[key] || '🌸';
  }

  filterOccasion(key: OccasionKey | 'sale') {
    this.productService.selectedOccasion.set(key);
    this.router.navigate(['/shop']);
  }

  onSearch(query: string) {
    this.productService.searchQuery.set(query);
    this.router.navigate(['/shop']);
  }
}
