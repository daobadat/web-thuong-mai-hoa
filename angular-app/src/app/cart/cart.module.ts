import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { OrderTrackingPageComponent } from './order-tracking-page/order-tracking-page.component';
import { SharedModule } from '../shared/shared.module';
import { QrPaymentComponent } from './qr-payment/qr-payment.component';

@NgModule({
  declarations: [
    CartPageComponent,
    CheckoutPageComponent,
    OrderTrackingPageComponent,
    QrPaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CartRoutingModule,
    SharedModule
  ]
})
export class CartModule { }
