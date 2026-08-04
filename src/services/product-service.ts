import type { PaginatedResponse, Product } from '../types'
import { ProductStatus } from '../types/product-types'
import { BaseService } from './base.service'

const GET_PRODUCT_QUERY = `
  query GetProduct($slug: String, $channel: String) {
    product(slug: $slug, channel: $channel) {
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
`

const LIST_PRODUCTS_QUERY = `
  query ListProducts($first: Int, $channel: String, $search: String, $categories: [ID!]) {
    products(first: $first, channel: $channel, filter: { search: $search, categories: $categories }) {
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
    images: node.thumbnail?.url || null,
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
 * ProductService provides functionality for accessing and managing products
 * in the Litekart platform.
 *
 * This service helps with:
 * - Retrieving product listings with various filtering options
 * - Fetching detailed product information
 * - Managing product reviews and ratings
 * - Accessing product-related content like reels
 */
export class ProductService extends BaseService {
  private static instance: ProductService

  /**
   * Get the singleton instance
   *
   * @returns {ProductService} The singleton instance of ProductService
   */
  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  private async fetchProductsList(
    page: number = 1,
    search: string = '',
    categoryId?: string,
    limit: number = 20
  ): Promise<PaginatedResponse<Product>> {
    const categories = categoryId ? [categoryId] : undefined;
    const res = await this.query<any>(LIST_PRODUCTS_QUERY, {
      first: limit,
      channel: 'default-channel',
      search: search || '',
      categories
    });

    const products = res?.products?.edges?.map((e: any) => mapSaleorProduct(e.node)) || [];
    const count = res?.products?.totalCount || 0;
    const noOfPage = Math.ceil(count / limit);

    return {
      data: products,
      count,
      pageSize: limit,
      noOfPage,
      page
    };
  }

  /**
   * Retrieves a list of featured products
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of featured products
   * @api {get} /api/products?search=Featured List featured products
   *
   * @example
   * // Get the first page of featured products
   * const featuredProducts = await productService.listFeaturedProducts({});
   */
  async listFeaturedProducts({ page = 1, sort = '-createdAt' }) {
    return this.fetchProductsList(page, undefined, undefined) as unknown as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves a list of trending products
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.search=''] - Additional search query
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of trending products
   * @api {get} /api/products?search=Trending List trending products
   *
   * @example
   * // Get trending products with additional filtering
   * const trendingProducts = await productService.listTrendingProducts({
   *   page: 1,
   *   search: 'shoes'
   * });
   */
  async listTrendingProducts({ page = 1, search = '', sort = '-createdAt' }) {
    const query = search ? `${search} Trending` : 'Trending';
    return this.fetchProductsList(page, query, undefined) as unknown as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves products related to a specific category
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.categoryId=''] - ID of the category to filter by
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of related products
   * @api {get} /api/products?categories=:categoryId List related products
   *
   * @example
   * // Get products related to a specific category
   * const relatedProducts = await productService.listRelatedProducts({
   *   categoryId: '123'
   * });
   */
  async listRelatedProducts({
    page = 1,
    categoryId = '',
    sort = '-createdAt'
  }) {
    return this.fetchProductsList(page, '', categoryId) as unknown as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves a general list of products with search and pagination
   *
   * @param {object} options - Options for filtering and pagination
   * @param {number} [options.page=1] - The page number to fetch
   * @param {string} [options.search=''] - Search query for filtering products
   * @param {string} [options.sort='-createdAt'] - Sort order for the results
   * @returns {Promise<PaginatedResponse<[Product]>>} Paginated list of products
   * @api {get} /api/products List products
   *
   * @example
   * // Search for products with a query
   * const products = await productService.list({
   *   search: 'red shoes',
   *   sort: 'price'
   * });
   */
  async list({ page = 1, search = '', sort = '-createdAt' }) {
    return this.fetchProductsList(page, search, undefined) as unknown as Promise<PaginatedResponse<[Product]>>
  }

  /**
   * Retrieves detailed information for a single product from Saleor
   *
   * @param {string} slug - The slug of the product to fetch
   * @returns {Promise<Product>} The product details
   * @throws {Error} If the product is not found
   *
   * @example
   * // Get details for a specific product
   * const product = await productService.getOne('red-running-shoes');
   */
  async getOne(slug: string): Promise<Product> {
    const res = await this.query<any>(GET_PRODUCT_QUERY, {
      slug,
      channel: 'default-channel'
    })

    if (!res?.product) {
      throw new Error(`Product not found for slug: ${slug}`)
    }

    return mapSaleorProduct(res.product)
  }

  /**
   * Adds a review and rating for a product
   *
   * @param {object} reviewData - The review data to submit
   * @param {string} reviewData.productId - ID of the product being reviewed
   * @param {string} reviewData.variantId - ID of the specific product variant
   * @param {string} reviewData.review - Text content of the review
   * @param {number} reviewData.rating - Numerical rating (typically 1-5)
   * @param {string[]} reviewData.uploadedImages - Array of image URLs to attach to the review
   * @returns {Promise<any>} The created review
   * @api {post} /api/products/ratings-and-reviews Add product review
   *
   * @example
   * // Add a product review with rating and images
   * await productService.addReview({
   *   productId: '123',
   *   variantId: '456',
   *   review: 'Great product, very comfortable!',
   *   rating: 5,
   *   uploadedImages: ['http://example.com/image1.jpg']
   * });
   */
  async addReview({
    productId,
    variantId,
    review,
    rating,
    uploadedImages
  }: {
    productId: string
    variantId: string
    review: string
    rating: number
    uploadedImages: string[]
  }) {
    return this.post('/api/products/ratings-and-reviews', {
      productId,
      variantId,
      review,
      rating,
      uploadedImages
    })
  }

  /**
   * Fetches product-related reels/short videos
   *
   * @returns {Promise<any>} Collection of product reels
   * @api {get} /api/reels Get product reels
   *
   * @example
   * // Get product video reels
   * const reels = await productService.fetchReels();
   */
  async fetchReels() {
    try {
      const res = await this.get('api/reels')
      return res
    } catch (e: unknown) {
      const error = e as {
        status?: string | number
        data?: { message?: string }
        message?: string
      }
      throw new Error(
        error.data?.message || error.message || 'Failed to fetch reels'
      )
    }
  }
}

// Use singleton instance
export const productService = ProductService.getInstance()

// // Export the instance methods for backward compatibility
// export const listFeaturedProducts = () => productService.listFeaturedProducts({})
