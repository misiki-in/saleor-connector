import { BaseService } from './base.service'

/**
 * PageService — Saleor connector. Methods mirror @misiki/litekart-connector's PageService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class PageService extends BaseService {
  private static instance: PageService
  static getInstance(): PageService {
    if (!PageService.instance) PageService.instance = new PageService()
    return PageService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
  async listLatestPages(..._args: any[]): Promise<any> { return this.emptyPage() }
  async getOne(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const pageService = PageService.getInstance()
