# 📝 Tổng Kết Các Công Việc Đã Thực Hiện

Dưới đây là danh sách toàn bộ các tính năng, sửa lỗi và cấu hình mà tôi đã thực hiện cho dự án **Thương mại điện tử hoa** của bạn:

## 1. Tích hợp Frontend (Angular) với Backend (NodeJS)

- **Thiết lập Proxy để tránh lỗi CORS**: 
  - Đã cấu hình file `proxy.conf.json` để chuyển hướng toàn bộ các request từ đường dẫn `/api/*` của Angular sang Backend `http://localhost:3000`.
  - Khắc phục lỗi BOM encoding (`InvalidSymbol`) trong file proxy.
  - Tích hợp `proxyConfig` vào file `angular.json` để dev server tự động chạy cùng cấu hình.
  
- **Cấu hình HttpClient cho Angular**:
  - Đã import `provideHttpClient` vào mảng `providers` trong `app.module.ts`. Việc này đã sửa triệt để lỗi "Blank Screen" (màn hình trắng bóc do thiếu Injector) khi các Service gọi API.
  - Chuyển `API_BASE_URL` trong `api.service.ts` từ URL tuyệt đối thành URL tương đối (`/api`) để thông qua Proxy.

- **Khởi tạo 5 Services quan trọng**:
  - `api.service.ts`: Xử lý HTTP requests chung, nhúng Token tự động.
  - `auth-api.service.ts`: Xử lý Đăng nhập, Đăng ký, lấy thông tin User (Signals).
  - `product-api.service.ts`: Xử lý API sản phẩm.
  - `cart-api.service.ts`: Xử lý giỏ hàng (hỗ trợ cả session_id cho khách ẩn danh và token cho user đã đăng nhập).
  - `order-api.service.ts`: Xử lý đơn hàng.

## 2. Nâng cấp tính năng Authentication (Đăng Nhập / Đăng Ký)

- **Trang Đăng ký (`Register`)**:
  - Gắn API thực tế gọi lên backend.
  - Thêm trường **Số điện thoại** (phone).
  - Thêm trường **Xác nhận mật khẩu** (confirmPassword) và code logic kiểm tra độ trùng khớp giữa 2 mật khẩu ngay tại giao diện.
  - Thêm tính năng **Mật khẩu mạnh (Strong Password Validator)** (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt) dựa trên Checklist bảo mật.
  - Bổ sung biểu tượng con mắt 👁️ để **Ẩn / Hiện mật khẩu**. Đồng bộ thao tác 1 nút ấn thay đổi cả 2 trường mật khẩu và xác nhận.

- **Trang Đăng nhập (`Login`)**:
  - Gắn API thực tế gọi lên backend, xử lý lưu `access_token` vào localStorage.
  - Đổi thông báo lỗi thành dạng **Generic Error Message** ("Thông tin đăng nhập không chính xác hoặc tài khoản đã bị khóa") thay vì báo lỗi cụ thể để chống hacker dò tìm email.
  - Sửa lỗi cú pháp của Angular 17+ (`NG5002` do dùng ký tự `@` trong template). Đã thay thế thành `&#64;`.
  - Thêm tính năng **Ẩn / Hiện mật khẩu** với biểu tượng con mắt 👁️.

- **Thanh Điều hướng (`Navbar`)**:
  - Cập nhật Navbar để lấy tên User tự động hiển thị khi Đăng nhập thành công, sử dụng `AuthApiService` kết hợp Signals.
  - Gỡ bỏ nút "Quản lý" mặc định hiển thị bừa bãi (bạn tự truy cập localhost/admin).
  - Căn chỉnh lại giao diện cân đối, thêm Dropdown với nút "Đăng xuất" (Xóa Token và dọn dẹp state).
  - Sửa một số lỗi cú pháp Typescript (`Object is possibly undefined` - lỗi TS2532) khi cắt chuỗi tên người dùng (`full_name`).

## 3. Quản lý Server & Xử lý lỗi hệ thống

- **Xử lý xung đột cổng (Port Conflict)**:
  - Khắc phục lỗi `EADDRINUSE: address already in use :::3000` của NodeJS bằng lệnh Taskkill trên Windows. Giải phóng các phiên bản Node đang chạy ngầm và khởi động lại Server sạch sẽ.
- **Khởi động đồng bộ**:
  - Setup chạy thành công cả Backend (Port 3000) và Frontend (Port 4200) cùng lúc.

---
## 4. Nâng cấp Trải nghiệm Người dùng (UX) và Bảo mật (Security) cho Menu Tài khoản

- **Bảo mật và Định tuyến (Route Guards):**
  - Tạo `AuthGuard` để chặn truy cập vào các trang yêu cầu đăng nhập. Nếu chưa đăng nhập, người dùng sẽ tự động bị điều hướng về trang đăng nhập kèm theo `returnUrl` (URL cũ muốn vào).
  - Tạo `AdminGuard` để bảo vệ các trang quản trị (`/admin`). Nếu cố tình thay đổi URL trên thanh địa chỉ, người dùng thường sẽ bị đẩy về trang chủ.
- **Xử lý Token và Đăng xuất (HTTP Interceptor & Multi-tab Sync):**
  - Thêm `AuthInterceptor` để tự động bắt lỗi `401 Unauthorized` từ API. Khi nhận mã lỗi này, ứng dụng sẽ xóa Token nội bộ và đưa người dùng về trang đăng nhập.
  - Lắng nghe sự kiện `storage` giữa các tab: Khi người dùng nhấn Đăng xuất ở tab A, tab B sẽ tự động phát hiện và thoát luôn phiên đăng nhập mà không cần f5.
- **Tối ưu Hóa Giao diện Navbar (Avatar & Dropdown):**
  - Chuyển nút Đăng nhập hiển thị tên gốc thành **Avatar hình tròn** lấy chữ cái đầu tiên của từ cuối cùng trong Tên gọi (chuẩn Tiếng Việt, vd "Thành Đạt" lấy chữ "Đ"), kèm màu sắc bắt mắt.
  - Sửa menu dropdown: Thêm mục "Cài đặt tài khoản" cho User và tách biệt phần "Quản trị Admin" bằng đường kẻ ngăn (`border-t`) nổi bật màu sắc riêng biệt giúp người dùng không bị bấm nhầm.
  - Tích hợp phím **Escape** để tự động đóng dropdown menu.
  - Hoàn thiện toàn bộ các nhãn Accessibility (`aria-expanded`, `aria-label`) hỗ trợ đọc màn hình và điều hướng bàn phím tốt hơn.
- **Chuẩn hóa Source Code:**
  - Định nghĩa Type chuẩn cho quyền User thông qua khai báo `enum Role { ADMIN, STAFF, CUSTOMER }` thay vì so sánh string rải rác. Sửa `AuthApiService` để đảm bảo an toàn kiểu dữ liệu.

---
## 5. Chuyển đổi và Hoàn thiện UI/UX từ HTML tĩnh sang Angular

Hoàn tất việc di chuyển các thiết kế HTML tĩnh từ file `index.html` cũ sang các component Angular, đảm bảo đồng bộ hoàn toàn về mặt thẩm mỹ và tương tác:

- **Chi tiết sản phẩm (Product Detail Page)**:
  - Thiết kế lại layout 2 cột sang trọng.
  - Thêm tính năng tính toán % giảm giá động, hiển thị voucher khuyến mãi, benefits cards (Giao miễn phí, Tặng thiệp, Giao nhanh).
  - Tích hợp 4 tab nội dung: Chi tiết, Hoa ngữ (ý nghĩa), Vận chuyển, và Đánh giá (kèm biểu đồ sao).
  - Thêm section "Sản phẩm tương tự" ở cuối trang.
  
- **Giỏ hàng (Cart Page)**:
  - Xây dựng Desktop Table Layout với đầy đủ thông tin: Ảnh, Sản phẩm, Số lượng, Đơn giá, Tổng.
  - Tích hợp Mobile Layout dạng danh sách thẻ (cards) hiển thị gọn gàng trên màn hình nhỏ.
  - Logic tính toán: Tạm tính, VAT 8%, Phí giao hàng (miễn phí đơn > 800k), tính năng nhập mã giảm giá (VD: HOATUOI giảm 5%).
  - Bổ sung thanh trạng thái tiến trình "Miễn phí giao hàng" sinh động.
  
- **Thanh toán (Checkout Page)**:
  - Form đặt hàng hoàn chỉnh: Thông tin người nhận, Ngày giao, Khung giờ giao (08:00-12:00, 12:00-17:00, 17:00-21:00), Lời nhắn thiệp.
  - Tích hợp lựa chọn phương thức thanh toán trực quan (Chuyển khoản, Momo/ZaloPay, COD, Thẻ).
  - Tạo màn hình xác nhận đặt hoa thành công (Checkout Success View).
  
- **Hệ thống Thông báo (Toast Notification)**:
  - Tạo `ToastService` sử dụng Signals để quản lý trạng thái thông báo toàn cục.
  - Tạo `ToastComponent` hiển thị các thông báo dạng popup (như "Đã thêm vào giỏ hàng") mượt mà, tự động ẩn sau 3 giây. Tích hợp sẵn hiệu ứng CSS Animation `fade-in-up`.
  - Tích hợp Toast vào `CartService` để phản hồi tức thì các thao tác giỏ hàng.

*Báo cáo này được tự động cập nhật dựa trên ngữ cảnh công việc đã hoàn thành.*
