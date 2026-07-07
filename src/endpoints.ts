/** Endpoint map for Saleor (relative to API base `undefined`). undefined => unsupported. */
export interface Endpoints {
  products?: string; categories?: string; collections?: string; orders?: string; coupons?: string
  customers?: string; addresses?: string; reviews?: string; wishlist?: string; cart?: string
  countries?: string; states?: string; currencies?: string; pages?: string; blog?: string
  settings?: string; paymentMethods?: string; vendors?: string; search?: string
}

export const EP: Endpoints = {
  products: undefined,
  categories: undefined,
  collections: undefined,
  orders: undefined,
  coupons: undefined,
  customers: undefined,
  addresses: undefined,
  reviews: undefined,
  wishlist: undefined,
  cart: undefined,
  countries: undefined,
  states: undefined,
  currencies: undefined,
  pages: undefined,
  blog: undefined,
  settings: undefined,
  paymentMethods: undefined,
  vendors: undefined,
  search: undefined,
}
