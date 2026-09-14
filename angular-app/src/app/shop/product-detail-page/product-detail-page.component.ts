import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  product?: Product;
  qty = 1;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.product = this.productService.products().find(p => p.id === id) || this.productService.products()[0];
    });
  }
}
