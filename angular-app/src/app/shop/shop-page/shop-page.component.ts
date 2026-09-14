import { Component, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { OccasionKey } from '../../core/models';

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

  occasions: OccasionKey[] = ['birthday', 'opening', 'wedding', 'corporate', 'chuseok', 'valentine'];

  setOccasion(occ: any) {
    this.productService.selectedOccasion.set(occ);
  }

  setCategory(cat: any) {
    this.productService.selectedCategory.set(cat);
  }

  getOccasionTitle(k: OccasionKey) {
    const titles: Record<OccasionKey, string> = {
      birthday: 'Hoa Sinh Nhật',
      opening: 'Hoa Khai Trương',
      wedding: 'Hoa Cưới Hỏi',
      corporate: 'Quà Doanh Nghiệp',
      chuseok: 'Hoa Chuseok',
      valentine: 'Valentine'
    };
    return titles[k] || k;
  }

  getCategoryName(cat: string) {
    const map: Record<string, string> = {
      bouquet: 'Bó hoa',
      box: 'Hộp hoa',
      basket: 'Giỏ hoa',
      stand: 'Kệ hoa'
    };
    return map[cat] || cat;
  }
}
