# Thay KakaoTalk → Zalo (hoặc Facebook) — Angular

Mục tiêu: bỏ hoàn toàn KakaoTalk, chỉ giữ **Zalo** (mặc định) hoặc **Facebook Messenger**, cấu hình tại **một nơi duy nhất** để sau này đổi kênh không phải sửa nhiều file.

Giả định: Angular standalone components, i18n bằng `@ngx-translate` (file `src/assets/i18n/vi.json`, `ko.json`). Nếu bạn dùng cách khác, chỉ cần đổi phần i18n.

---

## 1. Tìm toàn bộ chỗ đang dùng Kakao

```bash
grep -rniE "kakao|카카오" src/ server/ --include="*.ts" --include="*.html" --include="*.scss" --include="*.json" --include="*.sql"
```

Các vị trí thường gặp: topbar, footer, trang liên hệ, nút chat nổi, template email xác nhận đơn, bảng translation trong DB, trang admin (cài đặt thông tin cửa hàng).

---

## 2. Cấu hình kênh liên hệ (single source of truth)

`src/app/core/config/contact.config.ts`

```ts
export type ContactChannelId = 'zalo' | 'facebook';

export interface ContactConfig {
  /** Kênh đang bật. Chỉ để 1 kênh nếu muốn "chỉ Zalo" hoặc "chỉ FB". */
  readonly enabled: readonly ContactChannelId[];
  readonly hotline: string;
  readonly zaloPhone: string;      // Số Zalo, dạng 0901234567
  readonly facebookPage: string;   // Username hoặc ID page, ví dụ: hoatuoivn
}

export const CONTACT_CONFIG: ContactConfig = {
  enabled: ['zalo'], // đổi thành ['facebook'] hoặc ['zalo', 'facebook']
  hotline: '0901234567',
  zaloPhone: '0901234567',
  facebookPage: 'hoatuoivn',
} as const;
```

---

## 3. Service dựng link (có validate, tránh injection)

`src/app/core/services/contact-link.service.ts`

```ts
import { Injectable } from '@angular/core';
import { CONTACT_CONFIG, ContactChannelId } from '../config/contact.config';

export interface ContactChannel {
  readonly id: ContactChannelId;
  readonly url: string;
  readonly labelKey: string;
  readonly icon: string;
}

const PHONE_RE = /^0\d{9,10}$/;
const FB_PAGE_RE = /^[A-Za-z0-9.\-_]{3,100}$/;

@Injectable({ providedIn: 'root' })
export class ContactLinkService {
  readonly channels: readonly ContactChannel[] = this.buildChannels();

  private buildChannels(): ContactChannel[] {
    const result: ContactChannel[] = [];

    for (const id of CONTACT_CONFIG.enabled) {
      try {
        switch (id) {
          case 'zalo':
            result.push({
              id,
              url: this.zaloUrl(CONTACT_CONFIG.zaloPhone),
              labelKey: 'contact.zalo',
              icon: 'assets/icons/zalo.svg',
            });
            break;
          case 'facebook':
            result.push({
              id,
              url: this.messengerUrl(CONTACT_CONFIG.facebookPage),
              labelKey: 'contact.facebook',
              icon: 'assets/icons/facebook.svg',
            });
            break;
        }
      } catch (err) {
        // Cấu hình sai thì bỏ kênh đó, không làm vỡ cả trang
        console.error(`[ContactLinkService] Invalid config for "${id}"`, err);
      }
    }
    return result;
  }

  private zaloUrl(phone: string): string {
    if (!PHONE_RE.test(phone)) {
      throw new Error('Số Zalo không hợp lệ');
    }
    return `https://zalo.me/${phone}`;
  }

  private messengerUrl(page: string): string {
    if (!FB_PAGE_RE.test(page)) {
      throw new Error('Facebook page không hợp lệ');
    }
    return `https://m.me/${encodeURIComponent(page)}`;
  }
}
```

---

## 4. i18n

`src/assets/i18n/vi.json`

```json
{
  "topbar": {
    "hotline": "Hotline",
    "delivery": "Giao nội thành 2–4 giờ",
    "freeShip": "Miễn phí giao đơn từ 800.000đ"
  },
  "contact": {
    "zalo": "Zalo",
    "facebook": "Messenger",
    "chatNow": "Chat ngay"
  }
}
```

`src/assets/i18n/ko.json`

```json
{
  "topbar": {
    "hotline": "핫라인",
    "delivery": "시내 2-4시간 배달",
    "freeShip": "800,000₫ 이상 무료 배달"
  },
  "contact": {
    "zalo": "잘로(Zalo)",
    "facebook": "메신저",
    "chatNow": "채팅하기"
  }
}
```

> Xóa các key `kakao*` cũ trong cả hai file.

---

## 5. Topbar

`topbar.component.ts`

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONTACT_CONFIG } from '../../core/config/contact.config';
import { ContactLinkService } from '../../core/services/contact-link.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  protected readonly hotline = CONTACT_CONFIG.hotline;
  protected readonly channels = inject(ContactLinkService).channels;
}
```

`topbar.component.html`

```html
<div class="topbar">
  <div class="container topbar__inner">
    <span>{{ 'topbar.hotline' | translate }}: {{ hotline }}</span>

    @for (ch of channels; track ch.id) {
      <span class="topbar__sep" aria-hidden="true">·</span>
      <a
        [href]="ch.url"
        target="_blank"
        rel="noopener noreferrer"
        class="topbar__link"
      >
        {{ ch.labelKey | translate }}: {{ hotline }}
      </a>
    }

    <span class="topbar__sep" aria-hidden="true">·</span>
    <span>{{ 'topbar.delivery' | translate }}</span>
    <span class="topbar__sep" aria-hidden="true">·</span>
    <span>{{ 'topbar.freeShip' | translate }}</span>
  </div>
</div>
```

```scss
.topbar__link {
  color: inherit;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
}

.topbar__sep {
  margin-inline: 6px;
  opacity: 0.6;
}
```

---

## 6. Nút chat nổi (thay nút Kakao nếu có)

`floating-contact.component.ts`

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactLinkService } from '../../core/services/contact-link.service';

@Component({
  selector: 'app-floating-contact',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './floating-contact.component.html',
  styleUrl: './floating-contact.component.scss',
})
export class FloatingContactComponent {
  protected readonly channels = inject(ContactLinkService).channels;
}
```

`floating-contact.component.html`

```html
@if (channels.length) {
  <nav class="floating-contact" aria-label="Liên hệ nhanh">
    @for (ch of channels; track ch.id) {
      <a
        class="floating-contact__btn"
        [href]="ch.url"
        target="_blank"
        rel="noopener noreferrer"
        [attr.aria-label]="ch.labelKey | translate"
      >
        <img [src]="ch.icon" alt="" width="28" height="28" loading="lazy" />
        <span class="floating-contact__text">{{ 'contact.chatNow' | translate }}</span>
      </a>
    }
  </nav>
}
```

`floating-contact.component.scss`

```scss
.floating-contact {
  position: fixed;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 16px 0 12px;
    border-radius: 999px;
    background: #6e2a34;
    color: #fbf6ef;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(43, 42, 38, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(43, 42, 38, 0.32);
    }
  }
}

@media (max-width: 640px) {
  .floating-contact__text {
    display: none; // mobile chỉ hiện icon
  }

  .floating-contact__btn {
    width: 48px;
    padding: 0;
    justify-content: center;
  }
}
```

Thêm `<app-floating-contact />` vào `app.component.html` (một lần duy nhất).

---

## 7. Footer / trang liên hệ

Thay mọi đoạn Kakao hard-code bằng vòng lặp dùng chung:

```html
@for (ch of channels; track ch.id) {
  <a [href]="ch.url" target="_blank" rel="noopener noreferrer">
    {{ ch.labelKey | translate }}
  </a>
}
```

(Inject `ContactLinkService` vào component tương ứng như ở mục 5.)

---

## 8. Backend

Nếu email xác nhận đơn hoặc API trả về thông tin cửa hàng có KakaoTalk, đưa về cùng một nguồn cấu hình.

`server/src/config/contact.ts`

```ts
export const contact = {
  hotline: process.env.CONTACT_HOTLINE ?? '0901234567',
  zaloPhone: process.env.CONTACT_ZALO_PHONE ?? '0901234567',
} as const;

const PHONE_RE = /^0\d{9,10}$/;

if (!PHONE_RE.test(contact.zaloPhone)) {
  throw new Error('CONTACT_ZALO_PHONE không hợp lệ');
}

export const zaloUrl = `https://zalo.me/${contact.zaloPhone}`;
```

Template email: thay `KakaoTalk: ...` bằng `Zalo: ${contact.zaloPhone}` (link `zaloUrl`). Nếu giá trị đến từ DB hoặc admin, escape HTML trước khi chèn vào template.

Nếu trước đây lưu Kakao trong DB (bảng cài đặt hoặc translation), dùng migration:

```sql
START TRANSACTION;

UPDATE store_settings
SET `key` = 'zalo_phone'
WHERE `key` = 'kakaotalk_id';

COMMIT;
```

(Đổi tên bảng/cột đúng với schema của bạn, backup trước khi chạy.)

---

## 9. Icon

Thêm `src/assets/icons/zalo.svg` (và `facebook.svg` nếu dùng). Nên lấy từ bộ nhận diện thương hiệu chính thức của Zalo/Meta. Xóa `kakao*.svg` không còn dùng.

---

## 10. Checklist kiểm tra

- [ ] `grep -rniE "kakao|카카오" src/ server/` không còn kết quả.
- [ ] Topbar VI: `Hotline: 0901 234 567 · Zalo: ...`; KR: `핫라인 ... · 잘로(Zalo) ...`.
- [ ] Bấm link mở `https://zalo.me/<số>` ở tab mới, không lộ `window.opener`.
- [ ] Đổi `enabled` sang `['facebook']` → chỉ còn Messenger, không lỗi.
- [ ] Mobile: nút nổi chỉ hiện icon, không che nút "Đặt ngay" / giỏ hàng.
- [ ] Chiều cao topbar không đổi khi đổi VI ↔ KR (xem phần fix header trước).

> Lưu ý nội dung: khách hàng mục tiêu là người Hàn ở Việt Nam, nhiều người quen dùng KakaoTalk. Nếu muốn giữ khả năng hỗ trợ họ, có thể bật cả hai kênh `['zalo', 'facebook']`, hoặc thêm email hỗ trợ ở footer thay vì Kakao.
