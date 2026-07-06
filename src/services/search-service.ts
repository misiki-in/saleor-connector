import { ProductSearchResult } from '../types/product-search-types'
import { BaseService } from './base.service'
import { Product, ProductStatus } from '../types/product-types'

const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($search: String, $first: Int, $channel: String) {
    products(filter: { search: $search }, first: $first, channel: $channel) {
      totalCount
      edges {
        node {
          id
          name
          slug
          seoTitle
          seoDescription
          description
          productType {
            name
          }
          category {
            id
            name
            slug
          }
          thumbnail {
            url
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    }
  }
`

function parseSaleorDescription(description: any): string | null {
  if (!description) return null;
  
  if (typeof description === 'string') {
    try {
      const parsed = JSON.parse(description);
      if (parsed && Array.isArray(parsed.blocks)) {
        return parsed.blocks
          .filter((block: any) => block?.data?.text)
          .map((block: any) => block.data.text)
          .join(' ')
          .replace(/<[^>]+>/g, '')
          .trim();
      }
      return description;
    } catch (e) {
      return description;
    }
  }
  
  if (typeof description === 'object' && Array.isArray(description.blocks)) {
    return description.blocks
      .filter((block: any) => block?.data?.text)
      .map((block: any) => block.data.text)
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .trim();
  }
  
  return typeof description === 'string' ? description : JSON.stringify(description);
}

function mapSaleorProduct(node: any): Product {
  return {
    id: node.id,
    active: true,
    status: ProductStatus.PUBLISHED,
    type: node.productType?.name || 'simple',
    vendorId: '',
    categoryId: node.category?.id || null,
    currency: node.pricing?.priceRange?.start?.gross?.currency || null,
    instructions: null,
    description: parseSaleorDescription(node.description),
    hsnCode: null,
    images: null,
    featuredImage: node.thumbnail?.url || null,
    thumbnail: node.thumbnail?.url || null,
    keywords: null,
    link: null,
    metaTitle: node.seoTitle || null,
    metaDescription: node.seoDescription || null,
    title: node.name,
    subtitle: null,
    popularity: 0,
    rank: 0,
    slug: node.slug,
    expiryDate: null,
    weight: node.weight?.value || null,
    mfgDate: null,
    mrp: node.pricing?.priceRange?.start?.gross?.amount || 0,
    price: node.pricing?.priceRange?.start?.gross?.amount || 0,
    costPerItem: 0,
    sku: null,
    stock: 0,
    allowBackorder: false,
    manageInventory: false,
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
  }
}

/**
 * SearchService provides a high-level API for product search operations
 * by leveraging the underlying Saleor GraphQL implementation.
 */
export class SearchService extends BaseService {
  private static instance: SearchService

  constructor(fetchFn?: typeof fetch) {
    super(fetchFn)
  }

  /**
   * Get the singleton instance
   *
   * @returns {SearchService} The singleton instance of SearchService
   */
  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
  }

  /**
   * Performs a product search using URL search parameters
   *
   * @param {URL} url - The URL containing search parameters in its query string
   * @param {string} [slug] - Optional category slug that overrides the one in URL params
   * @returns {Promise<ProductSearchResult>} Structured search results with products and facets
   */
  async searchWithUrl(url: URL, slug?: string): Promise<ProductSearchResult> {
    try {
      const searchParams = new URLSearchParams(url.search)
      const searchQuery = searchParams.get('search') || ''
      // Optional category fallback if provided
      const finalSearch = slug ? `${slug} ${searchQuery}`.trim() : searchQuery;
      const limit = 20

      const res = await this.query<any>(SEARCH_PRODUCTS_QUERY, {
        search: finalSearch,
        first: limit,
        channel: 'default-channel' // Default channel
      })

      const productsData = res?.products?.edges?.map((e: any) => mapSaleorProduct(e.node)) || []
      const totalCount = res?.products?.totalCount || 0

      return {
        data: productsData,
        count: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        categoryHierarchy: [],
        facets: {
          priceStat: { min: undefined, max: undefined },
          categories: [],
          tags: [],
          allFilters: {}
        }
      }
    } catch (error) {
      console.error(error)
      return this.emptyResult()
    }
  }

  /**
   * Search through Saleor with a simple query string
   *
   * @param {string} query - The search query string
   * @returns {Promise<ProductSearchResult>} Structured search results with products and facets
   */
  async searchWithQuery(query: string): Promise<ProductSearchResult> {
    try {
      const res = await this.query<any>(SEARCH_PRODUCTS_QUERY, {
        search: query || '',
        first: 20,
        channel: 'default-channel'
      })

      const productsData = res?.products?.edges?.map((e: any) => mapSaleorProduct(e.node)) || []
      const totalCount = res?.products?.totalCount || 0

      return {
        data: productsData,
        count: totalCount,
        totalPages: Math.ceil(totalCount / 20),
        categoryHierarchy: [],
        facets: {
          priceStat: { min: undefined, max: undefined },
          categories: [],
          tags: [],
          allFilters: {}
        }
      }
    } catch (error) {
      console.error(error)
      return this.emptyResult()
    }
  }

  /**
   * Create an empty product search result
   *
   * @returns {ProductSearchResult} Empty result object with default values
   */
  emptyResult(): ProductSearchResult {
    return {
      data: [],
      count: 0,
      totalPages: 0,
      categoryHierarchy: [],
      facets: {
        priceStat: { min: undefined, max: undefined },
        categories: [],
        tags: [],
        allFilters: {}
      }
    }
  }
}

// Use singleton instance
export const searchService = SearchService.getInstance()
