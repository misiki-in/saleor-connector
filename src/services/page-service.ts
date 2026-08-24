import type { Page, PaginatedResponse } from './../types'

/**
 * PageService provides functionality for working with specific resources.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class PageService {
  private static instance: PageService

  private dummyPages: Page[] = [
    {
      id: '1',
      name: 'About Us',
      slug: 'about-us',
      content: '<h1>About Us</h1><p>Welcome to our store!</p>',
      metaDescription: 'Learn more about us',
      metaKeywords: 'about, store',
      metaTitle: 'About Us - Store',
      status: 'published',
      type: 'standard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      desktopBanners: [],
      mobileBanners: []
    },
    {
      id: '2',
      name: 'Contact Us',
      slug: 'contact-us',
      content: '<h1>Contact Us</h1><p>Get in touch with us.</p>',
      metaDescription: 'Contact our store',
      status: 'published',
      type: 'standard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      desktopBanners: [],
      mobileBanners: []
    }
  ]

  /**
   * Get the singleton instance
   * 
   * @returns {PageService} The singleton instance of PageService
   */
  static getInstance(): PageService {
    if (!PageService.instance) {
      PageService.instance = new PageService()
    }
    return PageService.instance
  }

  /**
   * Fetches Page from the API
   * 
   * @param {Object} options - The request options
   * @param {number} [options.page=1] - The page number for pagination
   * @param {string} [options.search=''] - Search query string
   * @param {string} [options.sort='-createdAt'] - Sort order
   * @returns {Promise<Page[]>} The requested data
   */
  async list({ page = 1, search = '', sort = '-createdAt' }: any = {}): Promise<Page[]> {
    return this.dummyPages;
  }

  /**
   * Fetches latest Pages from the API
   * 
   * @returns {Promise<PaginatedResponse<Page>>} The requested data
   */
  async listLatestPages({}: any = {}): Promise<PaginatedResponse<Page>> {
    return {
      data: this.dummyPages,
      count: this.dummyPages.length,
      pageSize: 10,
      noOfPage: 1,
      page: 1
    }
  }

  /**
   * Fetches a single Page by ID
   * 
   * @param {string} id - The ID of the page to fetch
   * @returns {Promise<Page>} The requested page
   */
  async getOne(id: string): Promise<Page> {
    // An id this connector has no static page for resolves empty rather than throwing. The
    // storefront asks for `home` on every visit, and a throw there is fatal to the whole page —
    // the routes that read this already render their empty state for `{}`.
    return (this.dummyPages.find((p) => p.id === id) ?? {}) as Page
  }
}

// Use singleton instance
export const pageService = PageService.getInstance()
