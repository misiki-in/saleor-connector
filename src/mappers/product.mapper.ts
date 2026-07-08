import { type Product, type Variant, ProductStatus } from '../types'

/** A loose shape of the Saleor product node we read from. */
type SaleorMoney = { amount?: number; currency?: string } | null | undefined
type SaleorProductNode = {
  id: string
  name?: string
  slug?: string
  description?: string
  seoTitle?: string
  seoDescription?: string
  thumbnail?: { url?: string } | null
  media?: Array<{ url?: string; alt?: string }>
  category?: { id?: string; name?: string } | null
  isAvailable?: boolean
  pricing?: {
    priceRange?: { start?: { gross?: SaleorMoney }; stop?: { gross?: SaleorMoney } }
    priceRangeUndiscounted?: { start?: { gross?: SaleorMoney } }
  } | null
  variants?: Array<{
    id: string
    name?: string
    sku?: string | null
    quantityAvailable?: number
    pricing?: { price?: { gross?: SaleorMoney }; priceUndiscounted?: { gross?: SaleorMoney } } | null
  }>
}

const money = (m: SaleorMoney): number => (m && typeof m.amount === 'number' ? m.amount : 0)

function mapVariant(v: NonNullable<SaleorProductNode['variants']>[number], productId: string): Variant {
  const price = money(v.pricing?.price?.gross)
  return {
    id: v.id,
    productId,
    title: v.name || '',
    sku: v.sku ?? null,
    price,
    mrp: money(v.pricing?.priceUndiscounted?.gross) || price,
    stock: v.quantityAvailable ?? 0,
    options: []
  }
}

/** Map a single Saleor product node into a litekart `Product`. */
export function mapProduct(node: SaleorProductNode, opts: { storeId?: string } = {}): Product {
  const start = node.pricing?.priceRange?.start?.gross
  const price = money(start)
  const mrp = money(node.pricing?.priceRangeUndiscounted?.start?.gross) || price
  const images = (node.media || []).map((m) => m.url).filter(Boolean) as string[]
  const featured = node.thumbnail?.url || images[0] || null
  const variants = (node.variants || []).map((v) => mapVariant(v, node.id))
  const stock = variants.reduce((sum, v) => sum + (v.stock || 0), node.variants ? 0 : 0)

  return {
    id: node.id,
    active: node.isAvailable ?? true,
    status: ProductStatus.PUBLISHED,
    type: 'physical',
    vendorId: opts.storeId || '',
    categoryId: node.category?.id ?? null,
    currency: start?.currency ?? null,
    instructions: null,
    description: node.description ?? null,
    hsnCode: null,
    images: images.length ? JSON.stringify(images) : null,
    featuredImage: featured,
    thumbnail: node.thumbnail?.url ?? featured,
    keywords: null,
    link: null,
    metaTitle: node.seoTitle || node.name || null,
    metaDescription: node.seoDescription ?? null,
    title: node.name || '',
    subtitle: null,
    popularity: 0,
    rank: 0,
    slug: node.slug ?? null,
    expiryDate: null,
    weight: null,
    mfgDate: null,
    mrp,
    price,
    costPerItem: 0,
    sku: variants[0]?.sku ?? null,
    stock,
    allowBackorder: false,
    manageInventory: true,
    shippingWeight: null,
    shippingHeight: null,
    shippingLen: null,
    shippingWidth: null,
    height: null,
    width: null,
    len: null,
    barcode: null,
    shippingCost: null,
    returnAllowed: false,
    replaceAllowed: false,
    originCountry: null,
    weightUnit: 'kg',
    dimensionUnit: 'cm',
    metadata: null,
    collectionId: null,
    options: [],
    variants
  }
}

/** Map a Saleor `products` connection into a litekart PaginatedResponse. */
export function mapProductList(
  connection: { edges?: Array<{ node: SaleorProductNode }>; totalCount?: number } | undefined,
  page: number,
  pageSize: number,
  opts: { storeId?: string } = {}
) {
  const data = (connection?.edges || []).map((e) => mapProduct(e.node, opts))
  const count = connection?.totalCount ?? data.length
  return {
    data,
    count,
    pageSize,
    noOfPage: pageSize ? Math.ceil(count / pageSize) : 1,
    page
  }
}
