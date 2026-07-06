import type { Category, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

const CATEGORY_FIELDS_FRAGMENT = `
  fragment CategoryFields on Category {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    level
    updatedAt
    backgroundImage {
      url
    }
  }
`

const GET_MEGAMENU_QUERY = `
  query GetMegamenu {
    categories(first: 10, level: 0) {
      edges {
        node {
          ...CategoryFields
          children(first: 20) {
            edges {
              node {
                ...CategoryFields
                children(first: 20) {
                  edges {
                    node {
                      ...CategoryFields
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${CATEGORY_FIELDS_FRAGMENT}
`

const LIST_CATEGORIES_QUERY = `
  query ListCategories($first: Int, $search: String) {
    categories(first: $first, filter: { search: $search }) {
      totalCount
      edges {
        node {
          ...CategoryFields
        }
      }
    }
  }
  ${CATEGORY_FIELDS_FRAGMENT}
`

const GET_CATEGORY_QUERY = `
  query GetCategory($slug: String) {
    category(slug: $slug) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS_FRAGMENT}
`

function mapSaleorCategory(node: any, parentId: string | null = null): Category {
  return {
    id: node.id,
    isActive: true,
    isInternal: false,
    isMegamenu: true,
    thumbnail: node.backgroundImage?.url || null,
    path: null,
    level: node.level !== undefined ? node.level : null,
    description: typeof node.description === 'string' ? node.description : (node.description ? JSON.stringify(node.description) : null),
    isFeatured: false,
    keywords: null,
    rank: 0,
    link: node.level === 0 ? null : `/${node.slug}`,
    metaDescription: node.seoDescription || null,
    metaKeywords: null,
    metaTitle: node.seoTitle || null,
    name: node.name,
    parentCategoryId: parentId,
    store: null,
    slug: node.slug,
    userId: '',
    activeProducts: 0,
    inactiveProducts: 0,
    createdAt: node.updatedAt || new Date().toISOString(),
    updatedAt: node.updatedAt || new Date().toISOString(),
    parent: null,
    children: node.children?.edges?.map((e: any) => mapSaleorCategory(e.node, node.id)) || []
  }
}

/**
 * CategoryService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CategoryService extends BaseService {
  private static instance: CategoryService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {CategoryService} The singleton instance of CategoryService
 */
  static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService()
    }
    return CategoryService.instance
  }
  private async fetchCategoriesList(limit: number, search?: string): Promise<PaginatedResponse<Category>> {
    const res = await this.query<any>(LIST_CATEGORIES_QUERY, {
      first: limit,
      search: search || ''
    });
    
    const categories = res?.categories?.edges?.map((e: any) => mapSaleorCategory(e.node)) || [];
    const count = res?.categories?.totalCount || 0;
    
    return {
      data: categories,
      count,
      pageSize: limit,
      noOfPage: Math.max(Math.ceil(count / limit), 1),
      page: 1
    };
  }

  /**
   * Fetches footer categories (often same as generic listing, mock with search query)
   */
  async fetchFooterCategories({ page = 1, q = '', sort = '-createdAt' }) {
    return this.fetchCategoriesList(20, q);
  }

  /**
   * Fetches featured categories
   */
  async fetchFeaturedCategories({ limit = 100 }) {
    return this.fetchCategoriesList(limit);
  }

  /**
   * Fetches a single Category by slug
   */
  async fetchCategory(id: string): Promise<Category> {
    const res = await this.query<any>(GET_CATEGORY_QUERY, { slug: id });
    if (!res?.category) {
      throw new Error(`Category not found for slug: ${id}`);
    }
    return mapSaleorCategory(res.category);
  }

  /**
   * Fetches all categories
   */
  async fetchAllCategories() {
    return this.fetchCategoriesList(100);
  }

  /**
   * Fetches all products of a category - wrapped in category response for compatibility
   */
  async fetchAllProductsOfCategories(id: string): Promise<PaginatedResponse<Category>> {
    const category = await this.fetchCategory(id);
    return {
      data: [category],
      count: 1,
      pageSize: 1,
      noOfPage: 1,
      page: 1
    };
  }

  /**
   * Fetches the hierarchical list of categories for the megamenu from Saleor
   * 
   * @returns {Promise<PaginatedResponse<Category>>} The requested category tree
   * 
   * @example
   * // Example usage
   * const megamenu = await categoryService.getMegamenu();
   */
  async getMegamenu(): Promise<PaginatedResponse<Category>> {
    const res = await this.query<any>(GET_MEGAMENU_QUERY);
    const data = res?.categories?.edges?.map((e: any) => mapSaleorCategory(e.node)) || [];
    return {
      data,
      count: data.length,
      pageSize: Math.max(data.length, 1),
      noOfPage: 1,
      page: 1
    };
  }
}

// // Use singleton instance
export const categoryService = CategoryService.getInstance()
