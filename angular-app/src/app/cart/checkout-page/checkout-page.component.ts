import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../../core/services/lang.service';
import { CartService } from '../../core/services/cart.service';
import { OrderApiService } from '../../core/services/order-api.service';

export interface SavedProfile {
  name: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
  standalone: false
})
export class CheckoutPageComponent implements OnInit {
  langService = inject(LangService);
  cartService = inject(CartService);
  router = inject(Router);

  name = '';
  phone = '';
  address = '';
  deliveryDate = '';
  deliveryTime = '08:00-12:00';
  cardMessage = '';
  paymentMethod: 'bank_transfer' | 'cod' | 'momo' | 'zalopay' | 'ewallet' | 'card' = 'bank_transfer';
  
  savedProfiles: SavedProfile[] = [];
  
  isSuccess = false;
  finalTotal = 0;
  
  // Trạng thái QR và thanh toán
  isPendingPayment = false;
  orderNumber = '';
  qrCodeUrl = '';

  orderApiService = inject(OrderApiService);

  get vi(): boolean {
    return this.langService.currentLang() === 'vi';
  }

  ngOnInit() {
    const today = new Date();
    this.deliveryDate = today.toISOString().split('T')[0];
    if (this.cartService.cartItems().length === 0 && !this.isSuccess) {
      this.router.navigate(['/cart']);
    }
    
    const profilesJson = localStorage.getItem('savedProfiles');
    if (profilesJson) {
      try {
        this.savedProfiles = JSON.parse(profilesJson);
      } catch (e) {}
    }
  }

  onProfileSelect(event: any) {
    const index = event.target.value;
    if (index !== '') {
      const p = this.savedProfiles[index];
      if (p) {
        this.name = p.name;
        this.phone = p.phone;
        this.address = p.address;
      }
    } else {
      this.name = '';
      this.phone = '';
      this.address = '';
    }
  }

  saveProfileToLocal() {
    const newProfile: SavedProfile = {
      name: this.name,
      phone: this.phone,
      address: this.address
    };
    
    const exists = this.savedProfiles.find(p => p.name === newProfile.name && p.phone === newProfile.phone && p.address === newProfile.address);
    if (!exists) {
      this.savedProfiles.unshift(newProfile);
      if (this.savedProfiles.length > 5) {
        this.savedProfiles.pop();
      }
      localStorage.setItem('savedProfiles', JSON.stringify(this.savedProfiles));
    }
  }

  formatPrice(n: number): string {
    return new Intl.NumberFormat('vi-VN').format(n);
  }

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get vat(): number {
    return Math.round(this.subtotal * 0.08); // 8% VAT
  }

  get shipping(): number {
    return this.subtotal >= 800000 ? 0 : 35000;
  }

  get total(): number {
    return this.subtotal + this.vat + this.shipping; // Simplified without coupon for checkout view
  }

  placeOrder(e: Event) {
    e.preventDefault();
    if (!this.name || !this.phone || !this.address || !this.deliveryDate) {
      alert(this.vi ? 'Vui lòng điền đầy đủ thông tin bắt buộc!' : '필수 정보를 모두 입력해주세요!');
      return;
    }
    
    const payload = {
      recipient_name: this.name,
      recipient_phone: this.phone,
      delivery_address: this.address,
      delivery_date: this.deliveryDate,
      card_message: this.cardMessage,
      payment_method: this.paymentMethod as any,
      note: ''
    };

    // Store final total before clearing cart
    this.finalTotal = this.total;

    this.orderApiService.checkout(payload).subscribe({
      next: (res: any) => {
        const orderData = res.data || res;
        this.orderNumber = orderData.order_number;
        this.saveProfileToLocal();
        
        if (this.paymentMethod === 'bank_transfer' && orderData.qrUrl) {
          // Hiện QR chuyển khoản
          this.qrCodeUrl = orderData.qrUrl;
          this.isPendingPayment = true;
          this.cartService.clearCart();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (this.paymentMethod === 'momo') {
          // Redirect sang MoMo
          this.orderApiService.createMomoPayment(orderData.id, orderData.order_number, this.finalTotal).subscribe({
            next: (payRes: any) => {
              if (payRes?.payUrl) {
                this.cartService.clearCart();
                window.location.href = payRes.payUrl;
              } else {
                alert(this.vi ? 'Không lấy được link MoMo! vui lòng thử lại!' : 'MoMo 링크를 가져올 수 없습니다.');
              }
            },
            error: () => alert(this.vi ? 'Lỗi kết nối MoMo! vui lòng thử lại!' : 'MoMo 연결 오류가 발생했습니다.')
          });
        } else if (this.paymentMethod === 'zalopay' as any) {
          // Redirect sang VNPay (zalopay slot tái dùng cho VNPay)
          this.orderApiService.createVnpayPayment(orderData.id, orderData.order_number, this.finalTotal).subscribe({
            next: (payRes: any) => {
              if (payRes?.payUrl) {
                this.cartService.clearCart();
                window.location.href = payRes.payUrl;
              } else {
                alert(this.vi ? 'Không lấy được link VNPay. Vui lòng thử lại!' : 'VNPay 링크를 가져올 수 없습니다.');
              }
            },
            error: () => alert(this.vi ? 'Lỗi kết nối VNPay, vui lòng thử lại!' : 'VNPay 연결 오류가 발생했습니다.')
          });
        } else {
          // COD hoặc thanh toán khác
          this.handlePaymentSuccess();
        }
      },
      error: (err) => {
        console.error("Lỗi đặt hàng", err);
        alert(this.vi ? 'Có lỗi xảy ra, vui lòng thử lại!' : '오류가 발생했습니다. 다시 시도해주세요!');
      }
    });
  }

  handlePaymentSuccess() {
    this.isPendingPayment = false;
    this.isSuccess = true;
    this.cartService.clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
