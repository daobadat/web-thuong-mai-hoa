export type Lang = 'vi' | 'ko';
export type Page = 'home' | 'shop' | 'cart' | 'checkout' | 'product' | 'order-tracking' | 'custom';
export type OccasionKey = string;

export interface Product {
  id: string;
  nameVi: string;
  nameKo: string;
  price: number;
  originalPrice?: number;
  occasions: OccasionKey[];
  category: string;
  img: string;
  descVi: string;
  descKo: string;
  meaningVi?: string;
  meaningKo?: string;
  isNew?: boolean;
  isPopular?: boolean;
  stock: number;
}

export interface CartItem {
  id?: string | number;
  product: Product;
  qty: number;
  note: string;
}
