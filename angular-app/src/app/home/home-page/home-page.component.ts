import { Component, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { OccasionKey } from '../../core/models';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  standalone: false
})
export class HomePageComponent {
  langService = inject(LangService);
  cartService = inject(CartService);
  productService = inject(ProductService);

  occasionKeys: OccasionKey[] = ['birthday', 'opening', 'wedding', 'corporate', 'chuseok', 'valentine'];

  get currentSlide() {
    return this.langService.t.heroSlides[0];
  }

  get popularProducts() {
    return this.productService.products().filter(p => p.isPopular).slice(0, 4);
  }

  getOccasionLabel(key: any) {
    const labels: Record<string, string> = {
      birthday: 'Hoa Sinh Nhật',
      opening: 'Hoa Khai Trương',
      wedding: 'Hoa Cưới Hỏi',
      corporate: 'Quà Doanh Nghiệp',
      chuseok: 'Hoa Chuseok',
      valentine: 'Valentine'
    };
    return labels[key] || key;
  }

  selectOccasion(key: any) {
    this.productService.selectedOccasion.set(key);
  }
}
