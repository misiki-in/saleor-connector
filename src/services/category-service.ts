import type { Category } from '../types'
import { mapProductList } from '../mappers/product.mapper'
import { BaseService } from './base.service'

function mapCategory(n: any): Category {
  return {
    id: n?.id || '',
    title: n?.name || '',
    slug: n?.slug ?? null,
    parentId: n?.parent?.id ?? null,
    description: n?.description ?? null,
    image: n?.backgroundImage?.url ?? null
  }
}

/**
 * CategoryService — Saleor categories, mapped to litekart `Category`.
 * Signatures mirror @misiki/litekart-connector's CategoryService.
 */
export class CategoryService extends BaseService {
  private static instance: CategoryService
  static getInstance(): CategoryService {
    if (!CategoryService.instance) CategoryService.instance = new CategoryService()
    return CategoryService.instance
  }

  async fetchAllCategories(): Promise<Category[]> {
    const query = `query Categories($first: Int!) {
      categories(first: $first, level: 0) { edges { node { id name slug description backgroundImage { url } parent { id } } } }
    }`
    const data = await this.graphql<{ categories: any }>(query, { first: 100 })
    return (data.categories?.edges || []).map((e: any) => mapCategory(e.node))
  }

  async fetchFeaturedCategories(_opts: { page?: number; perPage?: number } = {}): Promise<Category[]> {
    return this.fetchAllCategories()
  }

  async fetchFooterCategories(_opts: { page?: number; perPage?: number } = {}): Promise<Category[]> {
    return this.fetchAllCategories()
  }

  async fetchCategory(id: string): Promise<Category> {
    const query = `query Category($id: ID!) {
      category(id: $id) { id name slug description backgroundImage { url } parent { id } }
    }`
    const data = await this.graphql<{ category: any }>(query, { id })
    return mapCategory(data.category)
  }

  async fetchAllProductsOfCategories(id: string) {
    const query = `query CatProducts($first: Int!, $channel: String!, $categoryId: [ID!]) {
      products(first: $first, channel: $channel, filter: { categories: $categoryId }) {
        totalCount edges { node { id name slug thumbnail { url } pricing { priceRange { start { gross { amount currency } } } } } }
      }
    }`
    const data = await this.graphql<{ products: any }>(query, {
      first: 20,
      channel: this.creds.channelId || 'default-channel',
      categoryId: [id]
    })
    return mapProductList(data.products, 1, 20, { storeId: this.creds.storeId })
  }

  /** No megamenu concept in Saleor — return the flat category list. */
  async getMegamenu() {
    return this.fetchAllCategories()
  }
}

export const categoryService = CategoryService.getInstance()
