# TÀI LIỆU TỔNG QUAN HỆ THỐNG BACKEND THƯƠNG MẠI ĐIỆN TỬ HOA TƯƠI
**Project:** Flower E-Commerce Backend (NodeJS-Core)  
**Database:** MySQL (`flower_shop`)  
**ORM / Migration Engine:** Sequelize ORM & Sequelize CLI  

---

## 📋 TÓM TẮT TOÀN BỘ CÁC CÔNG VIỆC ĐÃ THỰC HIỆN

Below is the complete summary of all completed work for building the Flower E-Commerce Backend (`NodeJS-Core`):

### 1. 🛠️ Cơ sở hạ tầng & Middleware (Kernels & Utils)
* **JWT Authentication Middleware** (`kernels/middlewares/authenticated.js`): Xác thực token JWT qua header `Authorization: Bearer <token>`, gắn thông tin người dùng vào `req.user`.
* **Phân quyền Role Middleware** (`kernels/middlewares/role.js`): Phân quyền truy cập API theo các vai trò (`admin`, `staff`, `customer`).
* **JWT Helper** (`utils/jwtUtils.js`): Bổ sung hàm `verify()` để giải mã token.
* **Kernel Validation Rules** (`kernels/rules/base.js`): Bổ sung các quy tắc kiểm tra kiểu dữ liệu số/boolean (`isNumeric`, `isInt`, `isDecimal`, `isBoolean`).

### 2. 🗄️ Mô hình dữ liệu (25 Sequelize Models)
Tạo đầy đủ 25 Models trong thư mục `models/`:
* **Người dùng & Xác thực**: `User`, `UserAddress`, `RefreshToken`
* **Đa ngôn ngữ & Danh mục**: `Category`, `CategoryTranslation`, `Occasion`, `OccasionTranslation`
* **Sản phẩm & Biến thể**: `Product`, `ProductTranslation`, `ProductImage`, `ProductVariant`, `ProductOccasion`
* **Giỏ hàng & Đơn hàng**: `Cart`, `CartItem`, `Order`, `OrderItem`, `OrderStatusHistory`
* **Thanh toán & Giao hàng**: `PaymentTransaction`, `DeliveryTimeSlot`, `Shipment`
* **Khuyến mãi & Tương tác**: `Coupon`, `ProductReview`, `Wishlist`, `Notification`

### 3. 📦 Chức năng các Module (Controllers, Services, Validations)
Xây dựng trọn bộ logic nghiệp vụ trong `modules/`:
* **`auth`**: Đăng ký, Đăng nhập, Lấy thông tin tài khoản đang đăng nhập (`/auth/me`).
* **`user`**: Cập nhật thông tin cá nhân, Quản lý danh sách địa chỉ nhận hàng (CRUD).
* **`category` & `occasion`**: Xem danh sách/chi tiết danh mục & dịp lễ theo ngôn ngữ (`vi`, `en`, `ko`), Admin quản lý CRUD.
* **`product`**: Lọc/Tìm kiếm/Phân trang sản phẩm, Quản lý biến thể & hình ảnh.
* **`cart`**: Quản lý giỏ hàng cho cả Khách vãng lai (qua header `session-id`) và Khách hàng đã đăng nhập.
* **`coupon`**: Áp dụng/Kiểm tra mã giảm giá (tính giảm theo % hoặc số tiền cố định), Admin quản lý mã.
* **`order`**: Đặt hàng (Checkout), tính tổng tiền, giảm giá, lưu lịch sử trạng thái đơn hàng và gửi thông báo tự động.
* **`review`**: Đánh giá sản phẩm (tự động kiểm tra khách đã mua hàng chưa, tự động cập nhật điểm `avg_rating` của sản phẩm).
* **`wishlist`**: Thêm/Xóa sản phẩm yêu thích.
* **`notification`**: Đọc thông báo, đánh dấu đã đọc.

### 4. 🗂️ Sequelize CLI Migrations (31 File)
Tạo toàn bộ 31 file migration trong `database/migrations/` theo thứ tự phụ thuộc khóa ngoại (Foreign Keys):
* `languages`, `users`, `user_oauth_accounts`, `refresh_tokens`, `user_addresses`
* `categories`, `category_translations`, `occasions`, `occasion_translations`
* `products`, `product_translations`, `product_images`, `product_variants`, `product_occasions`
* `carts`, `cart_items`, `coupons`, `orders`, `order_items`, `order_status_history`
* `payment_transactions`, `delivery_time_slots`, `shipments`
* `product_reviews`, `wishlists`, `notifications`, `admin_audit_logs`
* `chatbot_conversations`, `chatbot_messages`, `ai_recommendation_logs`, `product_embeddings`

### 5. ☘️ Sequelize CLI Seeders (7 File)
Khởi tạo dữ liệu mẫu thực tế cho shop hoa trong `database/seeders/`:
* **Ngôn ngữ**: Tiếng Việt (`vi`), English (`en`), 한국어 (`ko`).
* **Người dùng**: Tài khoản Admin (`admin@flowershop.com`), Staff (`staff@flowershop.com`), Customer (`customer@gmail.com` & `kim.minjun@naver.com`) - Mật khẩu mẫu: `123456`.
* **Danh mục & Dịp lễ**: Hoa Sinh Nhật, Hoa Khai Trương, Hoa Cưới, Valentine, 8/3, Chuseok... kèm bản dịch 3 ngôn ngữ.
* **Sản phẩm mẫu**: Bó hoa hồng đỏ, Giỏ hoa hướng dương, Kệ hoa khai trương... đi kèm hình ảnh, biến thể size, giá và liên kết dịp lễ.
* **Mã giảm giá**: `WELCOME10`, `FLOWER2026`, `CHUSEOK50`.
* **Khung giờ giao hàng**: Các khung giờ Sáng (8-12h), Chiều (13-17h), Tối (18-21h).

### 6. ✅ Kiểm thử & Xác nhận thành công
* **Run Migrations**: `npx sequelize-cli db:migrate` -> ✅ Thành công 31/31 migrations.
* **Run Seeders**: `npx sequelize-cli db:seed:all` -> ✅ Thành công 7/7 seeders.
* **Database Connection**: `Sequelize authenticate()` -> ✅ Kết nối MySQL hoạt động bình thường.

---

## I. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY DỰ ÁN

### 1. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Cấu hình môi trường (`.env`)
Tạo hoặc chỉnh sửa file `.env` ở thư mục gốc của dự án với các thông số:
```env
PORT=3000
DATABASE_ENV=development
DATABASE_USERNAME=root
DATABASE_PASSWORD=.Dat123456789
DATABASE_NAME=flower_shop
DATABASE_HOST=localhost
DATABASE_PORT=3306
JWT_SECRET_KEY=flower_shop_jwt_super_secret_key_2026
```

### 3. Thực thi Database Migrations & Seeders
Chạy lệnh khởi tạo toàn bộ các bảng trong MySQL và nạp dữ liệu mẫu:
```bash
# Tạo các bảng cơ sở dữ liệu
npx sequelize-cli db:migrate

# Nạp dữ liệu mẫu (Languages, Users, Categories, Occasions, Products, Coupons, Time Slots)
npx sequelize-cli db:seed:all
```

Các lệnh quản lý bổ sung:
```bash
# Hoàn tác migration gần nhất
npx sequelize-cli db:migrate:undo

# Hoàn tác toàn bộ migrations (xóa sạch bảng)
npx sequelize-cli db:migrate:undo:all

# Hoàn tác toàn bộ dữ liệu mẫu (seeders)
npx sequelize-cli db:seed:undo:all
```

### 4. Chạy ứng dụng Backend
```bash
# Chạy ở chế độ Start thông thường
npm run start

# Chạy ở chế độ Development (tự động refresh khi sửa code qua nodemon)
npm run dev
```

---

## II. CẤU TRÚC THƯ MỤC DỰ ÁN

```
NodeJS-Core-main/
├── configs/               # Cấu hình hệ thống (database.js, app.js...)
├── database/              # Chứa Migrations & Seeders của Sequelize CLI
│   ├── migrations/        # 31 file migration theo đúng FK dependency
│   └── seeders/           # 7 file seeder nạp dữ liệu mẫu thực tế
├── kernels/               # Middleware & Validation rules lõi
│   ├── middlewares/       # authenticated.js, role.js, index.js
│   └── rules/             # Chứa quy tắc validate dữ liệu request
├── models/                # 25 Sequelize models đại diện các bảng DB
├── modules/               # Logic nghiệp vụ phân theo từng module
│   ├── auth/              # Đăng ký, đăng nhập, me
│   ├── user/              # Hồ sơ cá nhân, địa chỉ giao hàng
│   ├── category/          # Danh mục hoa tươi + đa ngôn ngữ (vi, en, ko)
│   ├── occasion/          # Dịp lễ + đa ngôn ngữ (vi, en, ko)
│   ├── product/           # Sản phẩm, biến thể, hình ảnh
│   ├── cart/              # Giỏ hàng (Session-based & User-based)
│   ├── coupon/            # Mã giảm giá
│   ├── order/             # Đặt hàng (Checkout), theo dõi đơn hàng
│   ├── review/            # Đánh giá sản phẩm
│   ├── wishlist/          # Sản phẩm yêu thích
│   └── notification/      # Thông báo người dùng
├── routes/
│   └── api.js             # Định tuyến toàn bộ RESTful API của hệ thống
├── utils/                 # jwtUtils.js, responseUtils.js
├── .sequelizerc           # Cấu hình đường dẫn cho Sequelize CLI
├── server.js              # Entry point khởi chạy Express app
└── thuong_mai_hoa.sql     # File SQL tham chiếu gốc
```

---

## III. DANH SÁCH BẢNG DỮ LIỆU & SEQUELIZE MODELS (25 MODELS)

| Stt | Tên Bảng (TableName) | Model Name | Mô Tả |
|---|---|---|---|
| 1 | `languages` | - | Lưu các ngôn ngữ hỗ trợ (`vi`, `en`, `ko`) |
| 2 | `users` | `User` | Người dùng hệ thống (Khách hàng, Nhân viên, Admin) |
| 3 | `user_oauth_accounts` | - | Liên kết đăng nhập Google / Facebook |
| 4 | `refresh_tokens` | `RefreshToken` | Lưu refresh token JWT mã hóa SHA-256 |
| 5 | `user_addresses` | `UserAddress` | Danh sách địa chỉ nhận hàng của người dùng |
| 6 | `categories` | `Category` | Danh mục sản phẩm (cây phân cấp `parent_id`) |
| 7 | `category_translations` | `CategoryTranslation` | Bản dịch tên & mô tả danh mục theo ngôn ngữ |
| 8 | `occasions` | `Occasion` | Các dịp lễ (Valentine, 8/3, 20/10, Chuseok, Sinh nhật) |
| 9 | `occasion_translations` | `OccasionTranslation` | Bản dịch tên & mô tả dịp lễ theo ngôn ngữ |
| 10 | `products` | `Product` | Sản phẩm hoa tươi (giá gốc, kho, điểm đánh giá) |
| 11 | `product_translations` | `ProductTranslation` | Bản dịch tên, mô tả & hướng dẫn chăm sóc hoa |
| 12 | `product_images` | `ProductImage` | Danh sách hình ảnh sản phẩm (ảnh chính, ảnh phụ) |
| 13 | `product_variants` | `ProductVariant` | Biến thể sản phẩm (Size tiêu chuẩn, Size cao cấp...) |
| 14 | `product_occasions` | `ProductOccasion` | Bảng phụ liên kết nhiều-nhiều giữa Sản phẩm & Dịp lễ |
| 15 | `carts` | `Cart` | Giỏ hàng (hỗ trợ cả Khách vãng lai qua `session_id`) |
| 16 | `cart_items` | `CartItem` | Chi tiết sản phẩm trong giỏ hàng (`unit_price_snapshot`) |
| 17 | `coupons` | `Coupon` | Mã giảm giá theo phần trăm (%) hoặc số tiền cố định |
| 18 | `orders` | `Order` | Đơn hàng, thông tin người nhận, thiệp chúc mừng, tổng tiền |
| 19 | `order_items` | `OrderItem` | Chi tiết sản phẩm trong đơn hàng (lưu snapshot tên & giá) |
| 20 | `order_status_history` | `OrderStatusHistory` | Lịch sử chuyển trạng thái đơn hàng |
| 21 | `payment_transactions` | `PaymentTransaction` | Giao dịch thanh toán (VNPay, MoMo, ZaloPay, COD...) |
| 22 | `delivery_time_slots` | `DeliveryTimeSlot` | Khung giờ giao hàng trong ngày (sáng, chiều, tối) |
| 23 | `shipments` | `Shipment` | Thông tin vận chuyển & đơn vị vận chuyển |
| 24 | `product_reviews` | `ProductReview` | Đánh giá & bình luận sản phẩm (kiểm tra đã mua hàng) |
| 25 | `wishlists` | `Wishlist` | Danh sách sản phẩm yêu thích của người dùng |
| 26 | `notifications` | `Notification` | Thông báo gửi tới người dùng |
| 27 | `admin_audit_logs` | - | Nhật ký thao tác quản trị của Admin |
| 28 | `chatbot_conversations` | - | Cuộc trò chuyện với Chatbot tư vấn hoa |
| 29 | `chatbot_messages` | - | Tin nhắn trong cuộc trò chuyện Chatbot |
| 30 | `ai_recommendation_logs` | - | Lịch sử gợi ý sản phẩm từ AI |
| 31 | `product_embeddings` | - | Vector embedding phục vụ AI recommendation |

---

## IV. DANH SÁCH CÁC API ENDPOINTS (`routes/api.js`)

### 1. Xác thực (`/auth`)
* `POST /auth/register` — Đăng ký tài khoản người dùng mới.
* `POST /auth/login` — Đăng nhập, nhận chuỗi Bearer JWT Token.
* `GET /auth/me` — *(Auth)* Lấy thông tin tài khoản đang đăng nhập.

### 2. Người dùng (`/user`)
* `PUT /user/profile` — *(Auth)* Cập nhật thông tin cá nhân.
* `GET /user/addresses` — *(Auth)* Lấy danh sách địa chỉ nhận hàng.
* `POST /user/addresses` — *(Auth)* Thêm địa chỉ nhận hàng mới.
* `DELETE /user/addresses/:id` — *(Auth)* Xóa địa chỉ nhận hàng.

### 3. Danh mục (`/categories`)
* `GET /categories` — Xem danh sách danh mục (hỗ trợ param `?lang=vi|en|ko`).
* `GET /categories/:id` — Xem chi tiết danh mục.
* `POST /categories` — *(Admin)* Tạo danh mục mới.
* `PUT /categories/:id` — *(Admin)* Cập nhật danh mục.
* `DELETE /categories/:id` — *(Admin)* Xóa danh mục.

### 4. Dịp lễ (`/occasions`)
* `GET /occasions` — Xem danh sách dịp lễ (hỗ trợ `?lang=vi|en|ko`).
* `GET /occasions/:id` — Xem chi tiết dịp lễ.
* `POST /occasions` — *(Admin)* Tạo dịp lễ mới.
* `PUT /occasions/:id` — *(Admin)* Cập nhật dịp lễ.
* `DELETE /occasions/:id` — *(Admin)* Xóa dịp lễ.

### 5. Sản phẩm (`/products`)
* `GET /products` — Lọc/Tìm kiếm/Phân trang sản phẩm (hỗ trợ `category_id`, `occasion_id`, `search`, `min_price`, `max_price`, `lang`, `page`, `limit`).
* `GET /products/:id` — Xem chi tiết sản phẩm kèm ảnh, biến thể, dịp lễ, đánh giá.
* `POST /products` — *(Admin/Staff)* Tạo sản phẩm mới.
* `PUT /products/:id` — *(Admin/Staff)* Cập nhật sản phẩm.
* `DELETE /products/:id` — *(Admin/Staff)* Xóa sản phẩm.

### 6. Giỏ hàng (`/cart`)
* `GET /cart` — Xem giỏ hàng (hỗ trợ cả user có Token hoặc khách vãng lai qua Header `x-session-id`).
* `POST /cart/add` — Thêm sản phẩm/biến thể vào giỏ hàng.
* `PUT /cart/items/:itemId` — Cập nhật số lượng sản phẩm trong giỏ.
* `DELETE /cart/items/:itemId` — Xóa sản phẩm khỏi giỏ hàng.

### 7. Mã giảm giá (`/coupons`)
* `POST /coupons/apply` — Kiểm tra và tính giá trị giảm giá của coupon.
* `GET /coupons` — *(Admin)* Danh sách tất cả các coupon.
* `POST /coupons` — *(Admin)* Tạo mã giảm giá mới.
* `PUT /coupons/:id` — *(Admin)* Cập nhật mã giảm giá.
* `DELETE /coupons/:id` — *(Admin)* Xóa mã giảm giá.

### 8. Đơn hàng (`/orders`)
* `POST /orders/checkout` — *(Auth)* Đặt hàng (chuyển các món từ giỏ hàng sang đơn hàng, áp dụng coupon, tạo shipment & lịch sử trạng thái).
* `GET /orders/my-orders` — *(Auth)* Lấy danh sách đơn hàng cá nhân.
* `GET /orders/:id` — *(Auth)* Xem chi tiết đơn hàng.
* `PUT /orders/:id/status` — *(Admin/Staff)* Cập nhật trạng thái đơn hàng (`pending` -> `confirmed` -> `delivered`...).

### 9. Đánh giá sản phẩm (`/reviews`)
* `GET /products/:productId/reviews` — Xem danh sách đánh giá của sản phẩm.
* `POST /reviews` — *(Auth)* Gửi đánh giá sản phẩm (tự động kiểm tra khách đã mua hàng chưa & tự động cập nhật `avg_rating` sản phẩm).
* `DELETE /reviews/:id` — *(Auth/Admin)* Xóa đánh giá.

### 10. Sản phẩm yêu thích (`/wishlist`)
* `GET /wishlist` — *(Auth)* Xem danh sách sản phẩm yêu thích.
* `POST /wishlist/:productId` — *(Auth)* Thêm sản phẩm vào danh sách yêu thích.
* `DELETE /wishlist/:productId` — *(Auth)* Xóa sản phẩm khỏi danh sách yêu thích.

### 11. Thông báo (`/notifications`)
* `GET /notifications` — *(Auth)* Xem danh sách thông báo.
* `PUT /notifications/read-all` — *(Auth)* Đánh dấu tất cả thông báo là đã đọc.
* `PUT /notifications/:id/read` — *(Auth)* Đánh dấu 1 thông báo là đã đọc.
* `DELETE /notifications/:id` — *(Auth)* Xóa thông báo.

---

## V. TÀI KHOẢN THỬ NGHIỆM MẶC ĐỊNH (DEMO ACCOUNTS)

Mật khẩu chung cho tất cả các tài khoản demo: `123456`

| Quyền hạn (Role) | Email | Mật Khẩu | Họ Và Tên | Ngôn Ngữ Mặc Định |
|---|---|---|---|---|
| **Admin** | `admin@flowershop.com` | `123456` | Quản Trị Viên (Admin) | `vi` |
| **Staff** | `staff@flowershop.com` | `123456` | Nhân Viên Shop (Staff) | `vi` |
| **Customer 1** | `customer@gmail.com` | `123456` | Nguyễn Văn Khách | `vi` |
| **Customer 2** | `kim.minjun@naver.com` | `123456` | Kim Min-Jun (김민준) | `ko` |
