export type Lang = 'vi' | 'ko'
export type Page = 'home' | 'shop' | 'cart' | 'checkout' | 'product' | 'order-tracking'
export type OccasionKey = 'birthday' | 'opening' | 'wedding' | 'corporate' | 'chuseok' | 'valentine'

export interface Product {
  id: number
  nameVi: string; nameKo: string
  price: number; originalPrice?: number
  occasions: OccasionKey[]
  category: 'bouquet' | 'box' | 'basket' | 'stand'
  img: string
  descVi: string; descKo: string
  meaningVi?: string; meaningKo?: string
  isNew?: boolean; isPopular?: boolean
  stock: number
}

export interface CartItem {
  product: Product
  qty: number
  note: string
}
