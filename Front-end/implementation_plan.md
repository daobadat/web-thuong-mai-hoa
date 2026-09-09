# Nâng cấp Website Thương Mại Điện Tử Bán Hoa Song Ngữ Việt-Hàn

## Bối cảnh

Dự án hiện có một codebase React + Vite + Tailwind CSS v4 đang chạy, bao gồm:
- **[App.tsx](file:///g:/Thương mại điện tử hoa (1)/Front-end/src/App.tsx)** (~2493 dòng): Trang khách hàng đầy đủ (Home, Shop, Cart, Checkout, Product Detail, Auth)
- **[AdminApp.tsx](file:///g:/Thương mại điện tử hoa (1)/Front-end/src/AdminApp.tsx)** (~965 dòng): Trang quản trị (Dashboard, Orders, Products, Customers, Analytics, Settings)
- Song ngữ Việt-Hàn hoạt động tốt
- 24 sản phẩm hoa, mock data đơn hàng/khách hàng
- Design system "Bouquet-material palette" đã thống nhất

### Vấn đề hiện tại (từ UI/UX Brief)
1. ❌ Link Admin xuất hiện trong nav công khai (sub nav bar)
2. ❌ Code monolith — toàn bộ trong 2 file lớn, khó maintain
3. ❌ Thiếu tính năng AI nổi bật (yêu cầu của đồ án)
4. ❌ Thiếu chatbot tư vấn song ngữ
5. ❌ Thiếu theo dõi đơn hàng (Order Tracking Timeline)
6. ❌ Thiếu đặt hoa theo yêu cầu / đặt trước theo dịp lễ

---

## User Review Required

> [!IMPORTANT]
> **Về tính năng AI**: Kế hoạch này bao gồm **AI Chatbot tư vấn song ngữ** + **Gợi ý hoa thông minh theo dịp/ngân sách**. Cả hai đều chạy ở front-end (mock API response) để demo, có thể tích hợp backend thực sau. Anh muốn tập trung vào cái nào trước?

> [!WARNING]
> **Về việc tách file**: Codebase hiện tại là monolith (App.tsx ~2500 dòng, AdminApp.tsx ~965 dòng). Kế hoạch sẽ **tách nhỏ thành các component/module riêng** để dễ bảo trì. Điều này là thay đổi lớn về cấu trúc nhưng **không thay đổi UI/UX hiện có**.

> [!IMPORTANT]
> **Về trang quản trị**: Link Admin hiện tại đang hiển thị trong nav bar công khai (vi: "Quản lý", ko: "관리자"). Kế hoạch sẽ **xóa hoàn toàn** khỏi nav khách hàng — chỉ truy cập qua URL `/admin` trực tiếp.

---

## Open Questions

> [!NOTE]
> **Đã xác nhận:**
> - ✅ Database: **MySQL** (quan hệ chặt chẽ, phù hợp đơn hàng/thanh toán)
> - ✅ Backend: **Đã có sẵn** (Node.js + Express), chỉ cần làm front-end
> - ✅ Ưu tiên: **Phase 1 trước** (sửa lỗi UI/UX + tách code)
>
> **Còn cần xác nhận sau:**
> - Chatbot AI dùng API nào? (Gemini, GPT, etc.)
> - Cổng thanh toán nào? (VNPay, Momo, etc.)
> - Tên thương hiệu chính thức?

---

## Proposed Changes

Kế hoạch chia thành **4 Phase chính**, thực hiện tuần tự:

---

### Phase 1: Cấu trúc lại code & Sửa lỗi UI/UX

Mục tiêu: Tách monolith thành module, sửa các lỗi đã phát hiện.

#### [MODIFY] [App.tsx](file:///g:/Thương mại điện tử hoa (1)/Front-end/src/App.tsx)
- Xóa link Admin khỏi sub navigation bar (dòng ~547-554)
- Tách types, constants, i18n strings ra file riêng
- Giữ nguyên các component đang hoạt động tốt

#### [NEW] `src/types/index.ts`
- Chuyển tất cả TypeScript types/interfaces ra file riêng: `Lang`, `Page`, `OccasionKey`, `Product`, `CartItem`

#### [NEW] `src/data/products.ts`
- Chuyển PRODUCTS array (24 items) ra file riêng
- Chuyển OCC, OCC_ICONS, OCC_INFO constants

#### [NEW] `src/i18n/translations.ts`
- Chuyển object `T` (vi/ko translations) ra file riêng
- Chuẩn bị structure cho thêm ngôn ngữ sau (nếu cần)

#### [NEW] `src/utils/helpers.ts`
- Chuyển `fmt()`, `discountPct()` ra file riêng

---

### Phase 2: Tính năng AI — Chatbot Tư Vấn Song Ngữ

Mục tiêu: Thêm chatbot nổi ở góc phải dưới, hỗ trợ tiếng Việt & Hàn.

#### [NEW] `src/components/AIChatbot.tsx`
- Widget chatbot floating button (góc phải dưới)
- Giao diện chat modern: bubble messages, typing indicator
- **Pre-built responses** cho các câu hỏi thường gặp:
  - Gợi ý hoa theo dịp (sinh nhật, khai trương, Chuseok, Valentine...)
  - Gợi ý theo ngân sách
  - Hướng dẫn đặt hàng
  - Ý nghĩa hoa (꽃말)
  - Thời gian giao hàng
- Auto-detect ngôn ngữ từ context `lang`
- Quick reply buttons cho các câu hỏi phổ biến
- Giao diện đóng/mở mượt mà

#### [NEW] `src/data/chatbot-responses.ts`
- Database câu hỏi-trả lời song ngữ
- Gợi ý sản phẩm theo keyword matching
- Lời chào theo ngôn ngữ hiện tại

---

### Phase 3: Gợi Ý Hoa Thông Minh & Đặt Trước Theo Dịp

Mục tiêu: Thêm tính năng gợi ý hoa AI và đặt trước theo dịp lễ.

#### [NEW] `src/components/AIRecommendation.tsx`
- Widget "Gợi ý hoa AI" trên trang chủ (sau hero carousel)
- Form nhập: Dịp → Ngân sách → Đối tượng nhận → AI gợi ý 3-5 sản phẩm phù hợp
- Hiệu ứng "đang phân tích..." cho cảm giác AI
- Kết quả hiển thị dạng card với lý do gợi ý

#### [NEW] `src/components/PreOrderByOccasion.tsx`
- Section "Đặt trước theo dịp lễ" trên trang chủ
- Hiển thị các dịp lễ sắp tới (Chuseok, Valentine Trắng, Giáng sinh...)
- Countdown timer cho mỗi dịp
- CTA "Đặt trước" với form đơn giản
- Lịch các ngày lễ Hàn Quốc & Việt Nam

#### [NEW] `src/data/korean-holidays.ts`
- Database các ngày lễ Hàn Quốc: Chuseok, Seollal, Valentine Trắng, Pepero Day, etc.
- Database các ngày lễ Việt Nam tương ứng
- Logic tính countdown

---

### Phase 4: Theo Dõi Đơn Hàng & Polish

Mục tiêu: Thêm trang theo dõi đơn hàng, polish tổng thể.

#### [NEW] `src/components/OrderTracking.tsx`
- Trang theo dõi đơn hàng với timeline ngang
- Sử dụng "ribbon underline" signature element cho trạng thái active
- Các trạng thái: Đặt hàng → Xác nhận → Chuẩn bị → Đang giao → Hoàn thành
- Hiển thị thông tin shipper, thời gian dự kiến
- Song ngữ đầy đủ

#### [MODIFY] [App.tsx](file:///g:/Thương mại điện tử hoa (1)/Front-end/src/App.tsx)
- Thêm page `'tracking'` vào type Page
- Tích hợp OrderTracking vào router
- Tích hợp AIChatbot overlay
- Tích hợp AIRecommendation và PreOrderByOccasion vào HomePage

#### [MODIFY] [index.css](file:///g:/Thương mại điện tử hoa (1)/Front-end/src/index.css)
- Thêm animations cho chatbot (slide-up, fade-in)
- Thêm animations cho AI recommendation (shimmer loading)
- Thêm styles cho order tracking timeline

#### [MODIFY] [index.html](file:///g:/Thương mại điện tử hoa (1)/Front-end/index.html)
- Thêm SEO meta tags đầy đủ
- Thêm Open Graph tags
- Cập nhật title & description

---

## Tóm tắt các file thay đổi

| Action | File | Mô tả |
|--------|------|--------|
| MODIFY | `src/App.tsx` | Xóa admin link, tích hợp components mới |
| MODIFY | `src/index.css` | Thêm animations mới |
| MODIFY | `index.html` | SEO meta tags |
| NEW | `src/types/index.ts` | TypeScript types |
| NEW | `src/data/products.ts` | Product data |
| NEW | `src/data/chatbot-responses.ts` | Chatbot Q&A database |
| NEW | `src/data/korean-holidays.ts` | Ngày lễ Hàn-Việt |
| NEW | `src/i18n/translations.ts` | i18n strings |
| NEW | `src/utils/helpers.ts` | Utility functions |
| NEW | `src/components/AIChatbot.tsx` | Chatbot widget |
| NEW | `src/components/AIRecommendation.tsx` | AI flower recommendation |
| NEW | `src/components/PreOrderByOccasion.tsx` | Pre-order by occasion |
| NEW | `src/components/OrderTracking.tsx` | Order tracking timeline |

---

## Verification Plan

### Automated Tests
```bash
cd "g:\Thương mại điện tử hoa (1)\Front-end"
pnpm run build
```
Build thành công = không có lỗi TypeScript/syntax.

### Manual Verification
1. Kiểm tra trang chủ hiển thị đúng: Hero → AI Recommendation → Occasion Grid → Best Sellers → Pre-order → Trust → Footer
2. Kiểm tra chatbot mở/đóng mượt mà, trả lời song ngữ
3. Kiểm tra link Admin **không** xuất hiện trong nav bar
4. Kiểm tra responsive trên mobile (Chrome DevTools)
5. Kiểm tra chuyển đổi VI ↔ KR không bị mixing ngôn ngữ
6. Kiểm tra order tracking timeline hiển thị đúng
7. Kiểm tra pre-order theo dịp lễ với countdown timer
