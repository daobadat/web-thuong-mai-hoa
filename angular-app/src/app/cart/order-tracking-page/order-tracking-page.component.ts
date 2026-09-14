import { Component, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-order-tracking-page',
  templateUrl: './order-tracking-page.component.html',
  styleUrls: ['./order-tracking-page.component.css'],
  standalone: false
})
export class OrderTrackingPageComponent {
  langService = inject(LangService);
  orderCode = '#HTSG-98234';
  orderFound = true;

  searchOrder() {
    this.orderFound = true;
  }
}
