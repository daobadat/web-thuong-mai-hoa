import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { OrderTrackingPageComponent } from './order-tracking-page/order-tracking-page.component';

const routes: Routes = [
  { path: '', component: CartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent },
  { path: 'order-tracking', component: OrderTrackingPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
