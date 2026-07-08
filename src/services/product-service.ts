import type { PaginatedResponse, Product } from '../types'
import { mapProduct, mapProductList } from '../mappers/product.mapper'
import { BaseService } from './base.service'

const PRODUCT_FIELDS = `
  id name slug description seoTitle seoDescription isAvailable
  thumbnail { url } media { url alt }
  category { id name }
  pricing {
    priceRange { start { gross { amount currency } } }
    priceRangeUndiscounted { start { gross { amount currency } } }
  }
  variants { id name sku quantityAvailable
    pricing { price { gross { amount currency } } priceUndiscounted { gross { amount currency } } } }
`

/**
 * ProductService — Saleor-backed, returns litekart `Product` shapes.
 * Method signatures mirror @misiki/litekart-connector's ProductService.
 */
export class ProductService extends BaseService {
  private static instance: ProductService
  static getInstance(): ProductService {
    if (!ProductService.instance) ProductService.instance = new ProductService()
    return ProductService.instance
  }

  /** List products. @returns litekart PaginatedResponse<Product> */
  async list({ page = 1, search = '', sort = '-createdAt' }: { page?: number; search?: string; sort?: string } = {}): Promise<
    PaginatedResponse<Product>
  > {
    const pageSize = 20
    const query = `query Products($first: Int!, $channel: String!, $search: String) {
      products(first: $first, channel: $channel, filter: { search: $search }, sortBy: { field: ${this.sortField(sort)}, direction: ${this.sortDir(sort)} }) {
        totalCount edges { node { ${PRODUCT_FIELDS} } }
      }
    }`
    const data = await this.graphql<{ products: any }>(query, {
      first: pageSize,
      channel: this.creds.channelId || 'default-channel',
      search: search || null
    })
    return mapProductList(data.products, page, pageSize, { storeId: this.creds.storeId }) as PaginatedResponse<Product>
  }

  /** Featured products. */
  async listFeaturedProducts({ page = 1, sort = '-createdAt' }: { page?: number; sort?: string } = {}) {
    return this.list({ page, sort })
  }

  /** Trending products. */
  async listTrendingProducts({ page = 1, search = '', sort = '-createdAt' }: { page?: number; search?: string; sort?: string } = {}) {
    return this.list({ page, search, sort })
  }

  /** Products in a category. */
  async listRelatedProducts({ page = 1, categoryId = '', sort = '-createdAt' }: { page?: number; categoryId?: string; sort?: string } = {}) {
    const pageSize = 20
    const query = `query CategoryProducts($first: Int!, $channel: String!, $categoryId: [ID!]) {
      products(first: $first, channel: $channel, filter: { categories: $categoryId }) {
        totalCount edges { node { ${PRODUCT_FIELDS} } }
      }
    }`
    const data = await this.graphql<{ products: any }>(query, {
      first: pageSize,
      channel: this.creds.channelId || 'default-channel',
      categoryId: categoryId ? [categoryId] : null
    })
    return mapProductList(data.products, page, pageSize, { storeId: this.creds.storeId })
  }

  /** Product detail by slug. */
  async getOne(slug: string): Promise<Product> {
    const query = `query Product($slug: String!, $channel: String!) {
      product(slug: $slug, channel: $channel) { ${PRODUCT_FIELDS} }
    }`
    const data = await this.graphql<{ product: any }>(query, {
      slug,
      channel: this.creds.channelId || 'default-channel'
    })
    return mapProduct(data.product, { storeId: this.creds.storeId })
  }

  /** Saleor has no native product reviews — dummy so callers never break. */
  async addReview(_args: { productId: string; variantId: string; review: string; rating: number; uploadedImages: string[] }) {
    return this.dummy({ success: true })
  }

  /** No reels concept in Saleor — dummy. */
  async fetchReels() {
    return this.dummy([] as unknown[])
  }

  private sortField(sort: string): string {
    const s = sort.replace(/^-/, '')
    if (s === 'price') return 'PRICE'
    if (s === 'name' || s === 'title') return 'NAME'
    return 'DATE'
  }
  private sortDir(sort: string): string {
    return sort.startsWith('-') ? 'DESC' : 'ASC'
  }
}

export const productService = ProductService.getInstance()
