# Tổng Kết Công Việc (Dự án Thương mại điện tử KFlower)

Tài liệu này tổng hợp lại toàn bộ các cập nhật và các lỗi đã xử lý gần đây nhằm đưa website hoạt động trơn tru với các chức năng và bảo mật cần thiết.

---

## 1. Cấu hình Database & Lỗi hiển thị Tiếng Việt
- **Vấn đề:** Lỗi font chữ tiếng Việt khi lưu vào database (chữ bị mã hoá thành `?` hoặc ký tự lạ do MySQL dùng mặc định `latin1`).
- **Giải pháp:**
  - Cập nhật cấu hình kết nối trong file `configs/database.js` để ép buộc sử dụng charset `utf8mb4` và collation `utf8mb4_unicode_ci`.
  - Viết lại quy trình drop, migrate và seed database từ đầu để dữ liệu mẫu (Sản phẩm, Danh mục, Translation) hiển thị tiếng Việt chính xác.

## 2. Fix bộ lọc Sản Phẩm (Danh mục / Dịp lễ)
- **Vấn đề:** Khi click vào các danh mục như "Bó hoa" hay dịp "Sinh nhật" trên frontend, không có sản phẩm nào hiện ra do lệch slug giữa frontend và backend (ví dụ: `bouquet` vs `bo-hoa`).
- **Giải pháp:**
  - Chuẩn hoá lại luồng gọi API và slug trên Angular frontend để khớp chuẩn xác 100% với dữ liệu từ backend Seeders.
  - Xử lý lại hàm Filter dưới backend để truy vấn đúng thông tin.

## 3. Tích hợp thanh toán trực tuyến (MoMo & VNPay)
- **Cấu hình:** Đã khai báo các biến môi trường cấu hình API Key (MOMO, VNPAY) vào file `.env`.
- **Backend (NodeJS):**
  - Viết lại hàm khởi tạo URL thanh toán cho MoMo (`buildMomoPayUrl`) và VNPay (`buildVnpayPayUrl`) tại `paymentService.js`.
  - Cài đặt IPN Server-to-Server Callback cho MoMo (`handleMomoIpn`) và xử lý bảo mật HMAC chữ ký.
  - Cài đặt Return URL xác thực thanh toán cho VNPay (`handleVnpayReturn`).
  - Mở 4 API routes tương ứng trong `paymentController.js` và `routes/api.js`.
- **Frontend (Angular):**
  - Gọi các API lấy URL thanh toán.
  - Tự động Redirect người dùng sang cổng thanh toán tương ứng ngay sau khi bấm "Đặt hàng" tại `checkout-page.component.ts`.

## 4. Bổ sung tính năng Người Dùng (Auth)
- Để hoàn thiện chuẩn thương mại điện tử, đã cập nhật hệ thống Xác minh & Khôi phục tài khoản:
  - **Database Migration:** Thêm 3 cột `reset_password_token`, `reset_password_expires`, và `verify_email_token` vào bảng `users`.
  - **Logic Backend:** Xây dựng logic tạo token bảo mật tại `authService.js`.
  - **API mới:** Cung cấp 3 API `/api/auth/forgot-password`, `/api/auth/reset-password` và `/api/auth/verify-email`.
  - Đã tích hợp hàm giả lập gửi Email (`emailUtils.js`) để phục vụ quá trình Reset Password sau này (chỉ cần gắn cấu hình gửi mail thật bằng nodemailer).

## 5. Tăng cường Bảo mật Server (Security Headers, Rate Limit, XSS)
- Để đáp ứng các checklist an toàn hệ thống cấp cao:
  - Cài đặt thêm các module: `helmet`, `express-rate-limit`, `xss-clean`.
  - Cấu hình file `index.js`:
    - Dùng **Helmet** che giấu các HTTP Headers nhạy cảm.
    - Dùng **XSS-Clean** chặn mọi payload độc hại bị chèn qua form/URL.
    - Bật **Rate Limiter** giới hạn 100 requests / 15 phút cho mỗi địa chỉ IP vào các API, chống lại tấn công dò mật khẩu (Brute-force) và Spam gây sập server.

## 6. Nâng cao Chất lượng Code & Vận hành (Logging, Testing)
- Để đảm bảo server chạy ổn định và dễ dàng gỡ lỗi trên môi trường Production:
  - **Logging chuyên sâu (Winston & Morgan):**
    - Cài đặt `winston`, `winston-daily-rotate-file`, `morgan`.
    - Thiết lập file `utils/logger.js` cấu hình tự động phân loại log (`error`, `combined`) và tự động xoay file log (daily rotate) lưu trữ trong 14 ngày.
    - Cập nhật Error Handler cuối của app sử dụng Winston để ghi nhận đầy đủ Stack Trace thay vì `console.log` thuần túy.
    - Dùng Morgan tích hợp với Winston để theo dõi toàn bộ request truy cập API một cách minh bạch.
  - **Testing (Jest & Supertest):**
    - Thiết lập cơ bản luồng Integration Test.
    - Đã tạo `tests/auth.test.js` để kiểm tra thử API đăng nhập, tạo nền tảng vững chắc để mở rộng kiểm thử các module (Giỏ hàng, Đặt hàng) sau này.

## 7. Giao diện Quên Mật Khẩu & Đặt Lại Mật Khẩu (Angular Frontend)
- Chưa có UI cho luồng quên/đặt lại mật khẩu, đã tạo mới 2 trang Angular:
  - **`/auth/forgot-password`** (`forgot-password-page`):
    - Form nhập Email.
    - Gọi API `POST /api/auth/forgot-password`.
    - Hiển thị thông báo thành công (yêu cầu kiểm tra hộp thư) hoặc lỗi.
  - **`/auth/reset-password`** (`reset-password-page`):
    - Đọc `?token=...` từ URL khi người dùng click link trong email.
    - Form nhập Mật khẩu mới + Xác nhận mật khẩu, có nút ẩn/hiện mật khẩu.
    - Validate: mật khẩu khớp, tối thiểu 6 ký tự.
    - Gọi API `POST /api/auth/reset-password` kèm token.
    - Tự động redirect về `/auth/login` sau 3 giây khi thành công.
  - Đã đăng ký 2 route mới trong `auth-routing.module.ts`.
  - Thêm link **"Quên mật khẩu?"** vào giao diện trang Đăng nhập.

## 8. Nâng cấp & Khắc phục toàn diện Dashboard Quản trị và Quản lý Đơn hàng
- **Widget "Cảnh báo tồn kho":**
  - **Khắc phục tên `[object Object]`:** Chuẩn hóa hàm resolve tên sản phẩm theo ngôn ngữ tiếng Việt ưu tiên từ mảng `translations` hoặc chuỗi `name`/`sku`, không in đè object lên template.
  - **Khắc phục "Còn undefined":** Đối chiếu và đọc chính xác trường `stock_quantity` từ API trả về thay vì đọc nhầm `p.stock`.
  - **Khắc phục ảnh lỗi `unde...`:** Chuẩn hóa hàm resolve URL ảnh (`images[0].url`, `image_url` hoặc placeholder chất lượng cao) kèm bộ xử lý `(error)="onImgError($event)"` chống vỡ giao diện.
  - Sắp xếp sản phẩm theo tồn kho tăng dần, phân màu cảnh báo (Hết hàng: Đỏ, Sắp hết ≤ 5: Vàng cam), bổ sung nút hành động "Nhập" liên kết nhanh tới trang Quản lý Sản phẩm.
- **Widget "Đơn hàng gần đây" & Bảng "Đơn hàng":**
  - **Khắc phục mã đơn UUID:** Đổi hiển thị từ mã UUID dài ngoằng sang mã đơn đọc được dạng `#ORD-...` hoặc `#HT-000X` lấy từ cột `order_number`.
  - **Khắc phục dấu `·` treo lơ lửng:** Bổ sung hàm tính thời gian tương đối (`relativeTime`: "5 phút trước", "1 giờ trước"...) và chỉ render dấu `·` khi có dữ liệu thời gian/số món kèm theo.
  - **Thông tin bổ sung:** Hiển thị số món (`itemCount`), trạng thái thanh toán (Đã TT / Chưa TT), địa chỉ quận rút gọn và tự động hiển thị avatar tòa nhà `🏢` (Doanh nghiệp) cho các khách hàng là công ty.
  - Cả dòng đơn hàng đều có thể nhấp để điều hướng sang trang chi tiết đơn.
- **Khắc phục số 0 hiển thị thành chữ "o":**
  - Loại bỏ old-style figures của font serif, áp dụng `font-variant-numeric: tabular-nums lining-nums;` và class `.stat-number` dùng font số hiện đại cho toàn bộ các thẻ KPI, số lượng đơn và giá tiền.
- **Khắc phục viền trắng dày ô Sidebar "Tổng quan":**
  - Loại bỏ outline mặc định của trình duyệt (`:focus:not(:focus-visible)`), thiết lập style active riêng biệt (`active-nav-link`) với nền gradient đậm và dải nhấn bên trái `border-l-4 border-rose-300`.
  - Thay thế icon emoji bằng bộ icon SVG chuẩn hóa.
  - Bổ sung badge số lượng đơn mới chờ duyệt tự động cập nhật bên cạnh mục "Đơn hàng".
  - Di chuyển thông tin Admin (Avatar, Họ tên, Email) và nút Đăng xuất xuống chân Sidebar.
- **Logic thời gian & Nghiệp vụ "Hôm nay":**
  - Ép toàn bộ thời gian về múi giờ Việt Nam **UTC+7 (Asia/Ho_Chi_Minh)**, tránh lệch số liệu quanh nửa đêm.
  - Doanh thu hôm nay tính chuẩn xác theo các đơn trong ngày không bị huỷ và đã thanh toán hoặc giao thành công.
- **Thẻ "Việc cần xử lý ngay":**
  - Chuyển thành các thẻ bấm được và điều hướng trực tiếp kèm bộ lọc trạng thái (`/admin/orders?status=new`, `status=preparing`,...).
  - Thẻ có số lượng = 0 được làm mờ nhẹ, thẻ có số lượng > 0 được làm nổi bật với hiệu ứng hover và mũi tên điều hướng.
- **Lịch giao hàng hôm nay:**
  - Tự động gộp thành Empty State thân thiện ("Hôm nay chưa có đơn giao theo khung giờ hẹn") khi cả 3 khung đều rỗng kèm link điều hướng.
  - Tự động phát hiện và làm nổi bật khung giờ đang diễn ra theo giờ thực tế.
- **Tách trạng thái tải & Tự động làm mới:**
  - Phân tách loading skeleton và error state cho từng widget độc lập.
  - Bổ sung nút "Làm mới" dữ liệu tức thời và cơ chế tự động poll làm mới ngầm mỗi 45 giây.

## 9. Đồng bộ Đa ngôn ngữ (Tiếng Hàn & Tiếng Việt) toàn diện cho Trang Quản Trị (Admin)
- **Cơ chế lưu trữ và đồng bộ ngôn ngữ (`LangService`):**
  - Lưu trữ trạng thái ngôn ngữ lựa chọn vào `localStorage.setItem('app_lang', lang)` và tự động khởi tạo khi load trang, đảm bảo khi người dùng chuyển sang tiếng Hàn ở ngoài trang chủ (`/`) thì khi truy cập vào `/admin` hệ thống vẫn giữ nguyên 100% tiếng Hàn.
  - Lắng nghe sự kiện `storage` để tự động đồng bộ tức thì giữa các tab trình duyệt.
- **Tích hợp nút chuyển đổi ngôn ngữ ngay trong Sidebar Admin:**
  - Bổ sung nút chuyển đổi ngôn ngữ nhanh `[ 🇰🇷 한국어 (KR) | 🇻🇳 Tiếng Việt (VI) ]` trực tiếp trên Sidebar trang quản lý.
- **Việt hoá / Hàn hoá toàn bộ Dashboard:**
  - Tiêu đề, trạng thái trực tuyến, ngày tháng (định dạng tiếng Hàn chuẩn: `2026년 10월 15일 목요일`), giờ cập nhật.
  - Thẻ KPI: Doanh thu hôm nay (오늘의 매출), Đơn cần giao (오늘 배송 예정), Đã hoàn thành (오늘 배송 완료).
  - Thẻ hành động: 신규 접수 주문, 미결제 주문, 제작 및 배송 준비, 재고 부족 경고.
  - Lịch giao hàng: 오늘의 배송 일정, 현재 진행 중, 미완료 배송 건 확인.
  - Đơn hàng gần đây: 최근 주문 내역, 기업 고객 (Doanh nghiệp), 결제완료 / 미결제, thời gian tương đối (방금 전, X분 전, X시간 전).
  - Cảnh báo tồn kho: 재고 부족 경고, 재고 관리, 품절, 입고 (Nhập hàng).
  - Tên sản phẩm trong widget tồn kho: Tự động ưu tiên lấy bản dịch tiếng Hàn (`nameKo` hoặc `translations` với `language_code: 'ko'`) khi đang ở ngôn ngữ tiếng Hàn.
- **Hàn hoá trang Cài đặt (Admin Settings):**
  - Chuyển ngữ toàn bộ tiêu đề (환경 설정), thông tin cửa hàng (상점 정보), giờ hoạt động và vận chuyển (운영 시간 및 배송 설정), thông báo và tự động hoá (알림 및 자동화), nút lưu cài đặt (설정 저장).
- **Hàn hoá trang Quản lý Đơn hàng (Admin Orders):**
  - Chuyển ngữ các tab trạng thái (전체, 신규 주문, 주문 접수, 상품 준비중, 배송중, 배송완료, 주문취소), các cột bảng dữ liệu, nhãn thông tin khách hàng và các nút điều hướng tiến trình đơn.

---
*Cập nhật lần cuối: 15/10/2026*
