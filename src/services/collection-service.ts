import type { Collection, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

const COLLECTION_FIELDS_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    backgroundImage {
      url
    }
  }
`

const LIST_COLLECTIONS_QUERY = `
  query ListCollections($first: Int, $search: String, $channel: String) {
    collections(first: $first, filter: { search: $search }, channel: $channel) {
      totalCount
      edges {
        node {
          ...CollectionFields
          products {
            totalCount
          }
        }
      }
    }
  }
  ${COLLECTION_FIELDS_FRAGMENT}
`

const GET_COLLECTION_QUERY = `
  query GetCollection($slug: String, $channel: String) {
    collection(slug: $slug, channel: $channel) {
      ...CollectionFields
      products {
        totalCount
      }
    }
  }
  ${COLLECTION_FIELDS_FRAGMENT}
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

function mapSaleorCollection(node: any): Collection {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    description: parseSaleorDescription(node.description),
    isActive: true,
    isFeatured: false,
    userId: '',
    productCount: node.products?.totalCount || 0,
    thumbnail: node.backgroundImage?.url || null,
    metaTitle: node.seoTitle || null,
    metaDescription: node.seoDescription || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * CollectionService provides functionality for working with specific resources.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CollectionService extends BaseService {
  private static instance: CollectionService

  /**
   * Get the singleton instance
   * 
   * @returns {CollectionService} The singleton instance of CollectionService
   */
  static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService()
    }
    return CollectionService.instance
  }

  /**
   * Fetches Collections from the Saleor API
   * 
   * @param {Object} options - The request options
   * @param {number} [options.page=1] - The page number for pagination
   * @param {string} [options.q=''] - Search query string
   * @param {string} [options.sort='-createdAt'] - Sort order
   * @returns {Promise<PaginatedResponse<Collection>>} The requested data
   */
  async list({ page = 1, q = '', sort = '-createdAt' }) {
    const limit = 20;
    const res = await this.query<any>(LIST_COLLECTIONS_QUERY, {
      first: limit,
      search: q,
      channel: 'default-channel'
    });

    const collections = res?.collections?.edges?.map((e: any) => mapSaleorCollection(e.node)) || [];
    const count = res?.collections?.totalCount || 0;

    return {
      data: collections,
      count,
      pageSize: limit,
      noOfPage: Math.max(Math.ceil(count / limit), 1),
      page: 1
    } as PaginatedResponse<Collection>;
  }

  /**
   * Fetches a single Collection by Slug
   * 
   * @param {string} slug - The slug of the collection to fetch
   * @returns {Promise<Collection>} The requested collection
   */
  async getOne(slug: string) {
    const res = await this.query<any>(GET_COLLECTION_QUERY, {
      slug,
      channel: 'default-channel'
    });

    if (!res?.collection) {
      throw new Error(`Collection not found for slug: ${slug}`);
    }

    return mapSaleorCollection(res.collection);
  }


  /**
 * Fetches a single Collection by ID
 * 
 * @param {string} id - The ID of the collection to fetch
 * @returns {Promise<any>} The requested collection
 * @api {get} /api/collection/:id Get collection by ID
 * 
 * @example
 * // Example usage
 * const collection = await collectionService.getAllRatings('123');
 */

  async getAllRatings() {
    return this.get('/api/collections/all-ratings') as Promise<Collection>
  }
}

// // Use singleton instance
export const collectionService = CollectionService.getInstance()
