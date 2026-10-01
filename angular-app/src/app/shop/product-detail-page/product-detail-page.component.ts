import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css'],
  standalone: false
})
export class ProductDetailPageComponent implements OnInit {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  product?: Product;
  qty = 1;
  activeTab: 'detail' | 'meaning' | 'delivery' | 'review' = 'detail';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.product = this.productService.products().find(p => p.id === id) || this.productService.products()[0];
      this.qty = 1;
      this.activeTab = 'detail';
      window.scrollTo({ top: 0 });
    });
  }

  get vi(): boolean {
    return this.langService.currentLang() === 'vi';
  }

  get discountPct(): number {
    if (!this.product?.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  get similarProducts(): Product[] {
    if (!this.product) return [];
    return this.productService.products()
      .filter(p => p.id !== this.product!.id && p.occasions.some(o => this.product!.occasions.includes(o)))
      .slice(0, 5);
  }

  getProductName(p: Product): string {
    return this.vi ? p.nameVi : p.nameKo;
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('vi-VN').format(n);
  }

  setTab(tab: 'detail' | 'meaning' | 'delivery' | 'review') {
    this.activeTab = tab;
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.qty);
    }
  }

  goToProduct(id: number) {
    this.router.navigate(['/shop/product', id]);
  }
}
