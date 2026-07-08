import { BaseService } from './base.service'

/**
 * BlogService — Saleor connector. Methods mirror @misiki/litekart-connector's BlogService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class BlogService extends BaseService {
  private static instance: BlogService
  static getInstance(): BlogService {
    if (!BlogService.instance) BlogService.instance = new BlogService()
    return BlogService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
  async getOne(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const blogService = BlogService.getInstance()
