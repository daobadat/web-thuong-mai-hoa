# 📋 TỔNG KẾT CÔNG VIỆC AI ĐÃ LÀM

**Dự án:** Web Thương Mại Điện Tử Hoa - KFlowerVN  
**Domain:** kflowervn.site  
**Stack:** Node.js (Express) + Angular + MySQL  
**Ngày thực hiện:** 06/10/2026  

---

## ✅ 1. CHUẨN BỊ DEPLOY LÊN HOSTING (cPanel)

### Backend (NodeJS-Core-main)
- Cập nhật `server.js` dùng `process.env.PORT` (tương thích cPanel)
- Cập nhật `index.js`: thêm **CORS** cho domain production `kflowervn.site`, serve static Angular từ `/public`
- Cập nhật `.gitignore` để loại trừ file nhạy cảm

### Frontend (Angular)
- Cập nhật `angular.json`: cấu hình production build, swap environment files
- Tạo file `environment.production.ts` với `apiUrl` production
- Tạo script `build-deploy.ps1` để build Angular và copy vào thư mục backend
- Tạo file `DEPLOY_GUIDE.md` hướng dẫn từng bước deploy lên cPanel

---

## ✅ 2. FIX BUG GIỎ HÀNG TỰ ĐỘNG CÓ SẢN PHẨM KHI ĐĂNG NHẬP

**File:** `angular-app/src/app/core/services/cart.service.ts`  
- Xoá hardcoded mock cart item "Bó Hồng Phấn" khỏi signal khởi tạo
- Giỏ hàng ban đầu luôn rỗng khi đăng ký/đăng nhập mới

---

## ✅ 3. FIX GIỎ HÀNG MẤT KHI F5 (RELOAD TRANG)

**File:** `angular-app/src/app/core/services/cart.service.ts`  
- Thêm `effect()` của Angular để **tự động lưu giỏ hàng vào `localStorage`** mỗi khi có thay đổi
- Thêm hàm `loadCart()` để đọc lại từ `localStorage` khi trang tải lại
- Key lưu: `kflower_cart`

---

## ✅ 4. HỆ THỐNG THANH TOÁN QR VIETQR + WEBHOOK

### Database
- Thêm cột `expires_at` (thời hạn thanh toán) vào bảng `orders`
- Thêm cột `paid_at` (thời gian đã thanh toán) vào bảng `orders`
- **Đã chạy migration thành công** — DB đã được cập nhật
- Gộp 2 cột vào file migration gốc `create-orders.js` cho gọn

### Backend — Payment Module mới (`modules/payment/`)

#### `paymentService.js`
- `buildVietQrUrl(orderNumber, amount)`: Tạo URL QR VietQR động theo từng đơn
- `handleWebhook(headers, body)`: Xử lý webhook từ SePay/Casso
  - Xác thực API Key bằng `crypto.timingSafeEqual` (chống timing attack)
  - Nhận dạng mã đơn `FLW-xxx` trong nội dung chuyển khoản
  - Dùng **Database Transaction + `SELECT ... FOR UPDATE`** chống race condition
  - **Idempotency**: kiểm tra trùng `provider_transaction_id`
  - Không tự duyệt khi thiếu tiền (UNDERPAID)
- `getPaymentStatus(orderNumber)`: Lấy trạng thái + kiểm tra hết hạn
- `expireStaleOrders()`: Cron — đánh dấu đơn hết hạn chưa thanh toán

#### `paymentController.js`
- `POST /api/payments/webhook` — Public, dùng API Key
- `GET /api/payments/status/:orderNumber` — Yêu cầu JWT (để poll)

### Backend — Cập nhật `orderService.js`
- Tính và lưu `expires_at` khi tạo đơn (mặc định 15 phút, từ `ORDER_TTL_MINUTES`)
- Nếu `payment_method === 'bank_transfer'` → tạo và trả về `qrUrl` trong response

### Backend — Cron Job (`server.js`)
- `setInterval` mỗi **5 phút** gọi `expireStaleOrders()` để dọn đơn hết hạn
- Log SQL mỗi lần chạy để dễ debug

### Frontend — `QrPaymentComponent` mới
- Hiển thị ảnh QR VietQR với số tiền đúng của đơn
- **Poll API** `GET /payments/status/:orderNumber` mỗi **3 giây** bằng `rxjs interval`
- Tự động `unsubscribe` khi `payment_status === 'paid'`
- Dùng `ApiService` (có Bearer token) để poll

### Frontend — Cập nhật `checkout-page`
- Khi chọn "Chuyển khoản ngân hàng" và xác nhận đặt hoa → gọi API backend thật (`POST /orders/checkout`)
- Backend trả về `qrUrl` → hiển thị `QrPaymentComponent`
- Khi poll phát hiện `paid` → tự chuyển sang màn hình "Đặt hoa thành công"
- Fix lỗi Angular compile: thay `[class.border-[...]]` bằng `[ngClass]`

### Biến môi trường mới (.env)
```
VIETQR_BANK_ID=MB
VIETQR_ACCOUNT_NO=0123456789
VIETQR_ACCOUNT_NAME=KFLOWERVN
WEBHOOK_API_KEY=your_secret_key
ORDER_TTL_MINUTES=15
```

---

## 📌 VIỆC BẠN CẦN LÀM TIẾP

### Cấu hình tài khoản ngân hàng thật
Mở file `.env` (local) và `.env.production` (hosting), điền:
- `VIETQR_BANK_ID` — Mã ngân hàng (VD: VCB, MB, TCB, ACB...)
- `VIETQR_ACCOUNT_NO` — Số tài khoản thật của bạn
- `VIETQR_ACCOUNT_NAME` — Tên chủ tài khoản (không dấu)

> Tra cứu mã ngân hàng tại: https://api.vietqr.io/v2/banks

### Đăng ký dịch vụ Webhook (1 trong 3)
| Dịch vụ | Link | Xác thực |
|---|---|---|
| **SePay** (khuyên dùng) | https://sepay.vn | API Key (Header) |
| **Casso** | https://casso.vn | API Key (Header) |
| **payOS** | https://payos.vn | Checksum (cần đổi logic xác thực) |

**Cấu hình webhook:**
- URL: `https://kflowervn.site/api/payments/webhook`
- Method: POST
- API Key: giá trị bạn đặt trong `WEBHOOK_API_KEY`

### Test thử
1. Thêm sản phẩm vào giỏ, đăng nhập, vào trang thanh toán
2. Chọn "Chuyển khoản ngân hàng" → Xác nhận đặt hoa
3. Màn hình QR hiện ra
4. Mở DataGrip/MySQL Workbench → sửa `payment_status = 'paid'` trong bảng `orders`
5. Sau 3 giây, web tự động chuyển sang "Đặt hoa thành công" ✅

---

## 📂 DANH SÁCH FILE ĐÃ THAY ĐỔI

| File | Loại thay đổi |
|---|---|
| `NodeJS-Core-main/server.js` | Cập nhật PORT động + thêm cron |
| `NodeJS-Core-main/index.js` | CORS production + serve Angular |
| `NodeJS-Core-main/.env` | Thêm biến VietQR/Webhook |
| `NodeJS-Core-main/.env.production` | Thêm biến VietQR/Webhook |
| `NodeJS-Core-main/.env.example` | Thêm biến VietQR/Webhook |
| `NodeJS-Core-main/models/order.js` | Thêm `expires_at`, `paid_at` |
| `NodeJS-Core-main/database/migrations/20260921000018-create-orders.js` | Thêm `expires_at`, `paid_at` |
| `NodeJS-Core-main/modules/order/services/orderService.js` | Thêm QR URL + expires_at khi tạo đơn |
| `NodeJS-Core-main/modules/payment/services/paymentService.js` | **Tạo mới** — Logic QR + Webhook |
| `NodeJS-Core-main/modules/payment/controllers/paymentController.js` | **Tạo mới** |
| `NodeJS-Core-main/routes/api.js` | Thêm payment routes |
| `NodeJS-Core-main/thuong_mai_hoa.sql` | Thêm `expires_at`, `paid_at` vào schema |
| `angular-app/src/app/core/services/cart.service.ts` | Fix giỏ hàng: localStorage persist + xoá mock data |
| `angular-app/src/app/cart/qr-payment/qr-payment.component.ts` | **Tạo mới** — Component QR poll |
| `angular-app/src/app/cart/qr-payment/qr-payment.component.html` | **Tạo mới** |
| `angular-app/src/app/cart/checkout-page/checkout-page.component.ts` | Gọi API thật + xử lý QR flow |
| `angular-app/src/app/cart/checkout-page/checkout-page.component.html` | Tích hợp QrPaymentComponent + fix lỗi compile |
| `angular-app/src/app/cart/cart.module.ts` | Đăng ký QrPaymentComponent |
| `angular-app/angular.json` | Cấu hình production build |
| `angular-app/src/environments/environment.production.ts` | URL production |
| `build-deploy.ps1` | Script build & deploy |
| `DEPLOY_GUIDE.md` | Hướng dẫn deploy cPanel |
