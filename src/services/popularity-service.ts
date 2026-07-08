import { BaseService } from './base.service'

/**
 * PopularityService — Saleor connector. Methods mirror @misiki/litekart-connector's PopularityService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class PopularityService extends BaseService {
  private static instance: PopularityService
  static getInstance(): PopularityService {
    if (!PopularityService.instance) PopularityService.instance = new PopularityService()
    return PopularityService.instance
  }

  async updatePopularity(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const popularityService = PopularityService.getInstance()
