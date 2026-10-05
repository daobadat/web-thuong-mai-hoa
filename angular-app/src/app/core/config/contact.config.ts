export type ContactChannelId = 'zalo' | 'facebook';

export interface ContactConfig {
  /** Kênh đang bật. Đổi thành ['facebook'] hoặc ['zalo', 'facebook'] tuỳ nhu cầu. */
  readonly enabled: readonly ContactChannelId[];
  readonly hotline: string;
  readonly zaloPhone: string;      // Số Zalo, dạng 0901234567
  readonly facebookPage: string;   // Username hoặc ID page
}

export const CONTACT_CONFIG: ContactConfig = {
  enabled: ['zalo'],               // ← đổi ở đây để bật/tắt kênh
  hotline: '0901234567',
  zaloPhone: '0901234567',
  facebookPage: 'hoatuoivn',
} as const;
