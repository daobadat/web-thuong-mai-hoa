import { Injectable } from '@angular/core';
import { CONTACT_CONFIG, ContactChannelId } from '../config/contact.config';

export interface ContactChannel {
  readonly id: ContactChannelId;
  readonly url: string;
  readonly icon: string;       // Emoji hoặc SVG path
  readonly labelVi: string;
  readonly labelKo: string;
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
              icon: '💬',
              labelVi: 'Zalo',
              labelKo: '잘로(Zalo)',
            });
            break;
          case 'facebook':
            result.push({
              id,
              url: this.messengerUrl(CONTACT_CONFIG.facebookPage),
              icon: '📘',
              labelVi: 'Messenger',
              labelKo: '메신저',
            });
            break;
        }
      } catch (err) {
        // Cấu hình sai → bỏ kênh đó, không vỡ trang
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
