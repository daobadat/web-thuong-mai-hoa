export type ContactChannelId = 'zalo' | 'facebook' | 'kakao';

export interface ContactConfig {
  /** Kênh đang bật. Đổi thành ['zalo', 'kakao'] hoặc thêm 'facebook' tuỳ nhu cầu. */
  readonly enabled: readonly ContactChannelId[];
  readonly hotline: string;
  readonly zaloPhone: string;      // Số Zalo, dạng 0901234567
  readonly kakaoId: string;        // KakaoTalk ID hoặc OpenChat link (kflower_vn)
  readonly facebookPage: string;   // Username hoặc ID page
}

export const CONTACT_CONFIG: ContactConfig = {
  enabled: ['zalo', 'kakao'],      // Bật cả Zalo và KakaoTalk
  hotline: '0901234567',
  zaloPhone: '0901234567',
  kakaoId: 'kflower_vn',
  facebookPage: 'hoatuoivn',
} as const;
