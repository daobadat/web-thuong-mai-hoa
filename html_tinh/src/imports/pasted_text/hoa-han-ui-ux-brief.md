# PROMPT THIẾT KẾ UI/UX — WEBSITE BÁN HOA SONG NGỮ VIỆT-HÀN

Bạn là design lead của một studio chuyên xây dựng nhận diện thị giác riêng biệt cho từng khách hàng — không dùng template có sẵn. Hãy thiết kế UI/UX cho website thương mại điện tử bán hoa dưới đây theo đúng brief, đưa ra lựa chọn có chủ đích về màu sắc, typography và bố cục, và dám lấy một rủi ro thẩm mỹ có thể giải thích được.

## 1. Bối cảnh & đối tượng

- Sản phẩm: website bán hoa tươi trực tuyến, song ngữ Việt – Hàn.
- Đối tượng chính: người Hàn Quốc đang sống/làm việc tại Việt Nam — quen với chuẩn UI tối giản, sạch, nhiều khoảng trắng, ảnh sản phẩm lớn, độ tin cậy cao (kiểu các brand lifestyle/thương mại Hàn: sạch sẽ, ít chi tiết thừa, thông tin rõ ràng, không rối mắt).
- Đối tượng phụ: khách Việt Nam mua hoa tặng người Hàn hoặc theo dịp lễ chung.
- Dịp mua hàng chính: sinh nhật, khai trương, quà tặng doanh nghiệp, các ngày lễ Hàn Quốc (Chuseok, Valentine Trắng 화이트데이, kỷ niệm 100 ngày/1 năm) và lễ Việt Nam.
- Nhiệm vụ số 1 của trang: giúp người dùng chọn đúng hoa cho đúng dịp và đặt hàng trong ít bước nhất, bằng ngôn ngữ họ thấy thoải mái nhất.

## 2. Định hướng thẩm mỹ (mood cụ thể — không dùng mặc định AI hay dùng)

Tránh 3 kiểu bố cục AI hay lặp lại: (a) nền be ấm + serif tương phản cao + accent cam đất, (b) nền đen + 1 accent neon, (c) bố cục "newspaper" viền chỉ mảnh bo góc 0. Thay vào đó, lấy cảm hứng trực tiếp từ **vật liệu của một bó hoa mới gói**: giấy kraft/giấy lụa gói hoa, dải ruy băng, thân lá xanh, sắc cánh hoa — không phải màu trang trí chung chung.

**Bảng màu (đặt tên theo vật liệu thật, không phải tên màu chung):**
- Nền chính — *Giấy lụa ngà*: `#FBF6EF`
- Chữ chính — *Mực than*: `#2B2A26` (không dùng đen tuyền)
- Xanh lá — *Lá dương xỉ* (thân/lá hoa): `#5F6F52`
- Hồng — *Cánh mẫu đơn* (accent nhẹ, dùng cho tag/hover): `#D9A6A0`
- Accent đậm (CTA, giá, nút chính) — *Rượu vang khô*: `#6E2A34`
- Đường viền/chia khối — *Sợi ruy băng be*: `#E4D9C8`

**Typography (bắt buộc hỗ trợ đầy đủ dấu tiếng Việt + Hangul):**
- Chữ UI/nút/nhãn (dùng chung cho cả 2 ngôn ngữ để đồng bộ cảm giác): **Pretendard** — sans Hàn hiện đại, hỗ trợ tốt Latin mở rộng.
- Tiêu đề lớn: **Noto Serif KR** cho bản tiếng Hàn, đi cùng **Fraunces** hoặc **Source Serif 4** cho bản tiếng Việt — canh cùng kích thước chữ, độ đậm, line-height để hai bản ngôn ngữ trông như cùng một thương hiệu, không phải hai bản dịch máy.
- Số/giá tiền: dùng cùng font UI, tabular figures, không dùng monospace kỹ thuật (sai tông với hoa).

**Layout — hero là luận điểm, không phải banner giảm giá:**
Mở đầu bằng một khoảnh khắc chọn dịp: ví dụ một dải "chọn theo dịp" lớn, trực quan (sinh nhật / khai trương / 100 ngày / quà công ty...) thay vì banner khuyến mãi chung chung. Đây là cấu trúc thật của nội dung — occasion là trục điều hướng chính của toàn site, không phải nhãn trang trí.

**Signature element (điểm nhấn riêng biệt của trang):** một chi tiết "dải ruy băng" mảnh chạy dưới tab danh mục đang chọn và dưới trạng thái đơn hàng đang active — ẩn dụ cho việc gói hoa, lặp lại nhất quán ở navigation, product tag, order status, không lạm dụng chỗ khác.

**Chuyển động:** tối giản, có chủ đích — ví dụ ảnh sản phẩm nở nhẹ (scale 1.02) khi hover, một hiệu ứng "cánh hoa rơi nhẹ" rất ngắn khi thêm vào giỏ. Không dùng animation tràn lan gây cảm giác "làm bởi AI".

## 3. Cấu trúc trang & thành phần bắt buộc

- **Header:** logo, chuyển ngữ VI/KR rõ ràng (không mix ngôn ngữ trên cùng 1 màn hình), tìm kiếm, giỏ hàng, tài khoản. **Không đặt link admin ở đây.**
- **Trang chủ:** hero chọn theo dịp → danh mục hoa theo dịp (grid ảnh lớn) → 1 khối "Best Sellers" duy nhất (không lặp lại ở nơi khác) → khối tin cậy (giao hàng trong ngày, cam kết hoa tươi, thanh toán an toàn) → footer.
- **Trang danh mục/lọc:** lọc theo dịp, mức giá, loại hoa; thẻ sản phẩm ảnh lớn, giá, 1–2 tag dịp.
- **Trang chi tiết sản phẩm:** ảnh lớn nhiều góc, giá, tuỳ chọn (kích thước bó/thiệp), và một khối riêng "ý nghĩa loài hoa" (꽃말/hoa ngữ) — chi tiết văn hoá quan trọng với khách Hàn khi tặng hoa.
- **Giỏ hàng & thanh toán:** tối đa 3 bước, hiển thị rõ ngày/giờ giao, ô nhập lời nhắn thiệp có preview.
- **Theo dõi đơn hàng:** trạng thái dạng timeline ngang, dùng chi tiết "ruy băng" ở trên.
- **Trang quản trị:** route/đường dẫn riêng biệt, **không xuất hiện trong nav công khai dưới bất kỳ hình thức nào** — đây là lỗi đang tồn tại cần sửa dứt điểm.

## 4. Những lỗi cụ thể cần tránh (đã phát hiện ở bản hiện tại — bản thiết kế mới phải giải quyết)

1. Không hiển thị lẫn lộn tiếng Việt và tiếng Hàn trên cùng một màn hình — mỗi thời điểm chỉ 1 ngôn ngữ, chuyển đổi tường minh bằng nút toggle.
2. Menu quản trị tuyệt đối không xuất hiện trong thanh điều hướng công khai.
3. Chỉ có **một** khối "Best Sellers" duy nhất trên trang chủ, không lặp ở hero carousel và section riêng.
4. Nút điều hướng carousel (dots) phải đạt độ tương phản đủ đọc (tối thiểu tỉ lệ 3:1 với nền theo WCAG), không dùng màu nhạt như hiện tại.

## 5. Yêu cầu chất lượng

- Responsive đầy đủ xuống mobile (khách Hàn ở VN dùng mobile là chính).
- Focus state bàn phím rõ ràng, tôn trọng `prefers-reduced-motion`.
- Chữ trên nút hành động dùng động từ chủ động, nhất quán xuyên suốt luồng (ví dụ nút "Đặt hoa" → toast xác nhận cũng phải dùng đúng từ "Đặt hoa đã gửi", không đổi thành từ khác).
- Trạng thái rỗng/lỗi (giỏ hàng trống, hết hàng) viết bằng giọng điệu rõ ràng, hướng dẫn hành động tiếp theo, không xin lỗi chung chung.

## 6. Stack công nghệ (để đầu ra khớp với codebase thật)

- Backend: **Node.js**
- Frontend: **React**

Yêu cầu khi thiết kế/generate UI:
- Xuất component dạng React (function component, JSX), chia nhỏ theo từng khối trong mục 3 (Header, HeroOccasionPicker, ProductGrid, ProductCard, BestSellersSection, ProductDetail, FlowerMeaningBlock, CartSummary, CheckoutSteps, OrderTimeline...).
- Toggle ngôn ngữ VI/KR nên quản lý bằng state/context ở React (ví dụ `LanguageContext`), không hard-code text trộn 2 ngôn ngữ trong cùng JSX render ra cùng lúc — đây chính là lỗi mixing ngôn ngữ đang tồn tại, cần tránh lặp lại ở tầng component.
- Route quản trị (admin) tách hẳn thành nhóm route riêng (ví dụ `/admin/*`), không import/link chung với layout của nav công khai, để tránh lộ ra ngoài như hiện tại.
- Style: dùng CSS Modules, Tailwind, hoặc styled-components đều được — nhưng bảng màu/token ở mục 2 nên khai báo tập trung (CSS variables hoặc theme object) để đồng bộ giữa các component, không rải hex code rời rạc từng nơi.

---
Khi đưa prompt này cho AI/designer, có thể bổ sung thêm: tên brand cụ thể và logo hiện có (nếu có) để đầu ra sát hơn với nhận diện thật.