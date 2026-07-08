import { BaseService } from './base.service'

/**
 * RegionService — Saleor connector. Methods mirror @misiki/litekart-connector's RegionService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class RegionService extends BaseService {
  private static instance: RegionService
  static getInstance(): RegionService {
    if (!RegionService.instance) RegionService.instance = new RegionService()
    return RegionService.instance
  }

  async getRegionByRegionId(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const regionService = RegionService.getInstance()
