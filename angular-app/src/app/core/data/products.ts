import { OccasionKey, Product } from '../models';

export const OCC: Record<OccasionKey, { vi: string; ko: string }> = {
  birthday:  { vi: 'Hoa Sinh Nhật',         ko: '생일 꽃' },
  opening:   { vi: 'Hoa Khai Trương',        ko: '개업 꽃' },
  wedding:   { vi: 'Hoa Cưới Hỏi',           ko: '결혼 꽃' },
  corporate: { vi: 'Quà Doanh Nghiệp',       ko: '기업 선물' },
  chuseok:   { vi: 'Chuseok 추석',            ko: '추석 꽃' },
  valentine: { vi: 'Valentine · 화이트데이',  ko: '화이트데이' },
};

export const OCCASION_KEYS: OccasionKey[] = ['birthday', 'opening', 'wedding', 'corporate', 'chuseok', 'valentine'];

export const OCC_ICONS: Record<OccasionKey, string> = {
  birthday:  '🎂',
  opening:   '🎋',
  wedding:   '💍',
  corporate: '💼',
  chuseok:   '🍂',
  valentine: '💝',
};

export const PRODUCTS: Product[] = [];

export const OCC_INFO: Record<string, any> = {
  birthday: { title: 'Hoa Sinh Nhật' },
  opening: { title: 'Hoa Khai Trương' },
  wedding: { title: 'Hoa Cưới Hỏi' },
  corporate: { title: 'Quà Doanh Nghiệp' },
  chuseok: { title: 'Hoa Chuseok' },
  valentine: { title: 'Valentine' }
};

