import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopPageComponent } from './shop-page/shop-page.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';
import { CustomBouquetPageComponent } from './custom-bouquet-page/custom-bouquet-page.component';

const routes: Routes = [
  { path: '', component: ShopPageComponent },
  { path: 'custom', component: CustomBouquetPageComponent },
  { path: 'product/:id', component: ProductDetailPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
