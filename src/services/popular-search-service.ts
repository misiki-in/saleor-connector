import { BaseService } from './base.service'

/**
 * PopularSearchService — Saleor connector. Methods mirror @misiki/litekart-connector's PopularSearchService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class PopularSearchService extends BaseService {
  private static instance: PopularSearchService
  static getInstance(): PopularSearchService {
    if (!PopularSearchService.instance) PopularSearchService.instance = new PopularSearchService()
    return PopularSearchService.instance
  }

  async listPopularSearch(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const popularSearchService = PopularSearchService.getInstance()
