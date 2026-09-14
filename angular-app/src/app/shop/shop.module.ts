import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopPageComponent } from './shop-page/shop-page.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';
import { CustomBouquetPageComponent } from './custom-bouquet-page/custom-bouquet-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShopPageComponent,
    ProductDetailPageComponent,
    CustomBouquetPageComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule
  ]
})
export class ShopModule { }
