import type { Product } from '../types'

export const fmt = (n: number): string => new Intl.NumberFormat('vi-VN').format(n)

export const discountPct = (p: Product): number =>
  p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
