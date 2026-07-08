import { BaseService } from './base.service'

/**
 * DealService — Saleor connector. Methods mirror @misiki/litekart-connector's DealService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class DealService extends BaseService {
  private static instance: DealService
  static getInstance(): DealService {
    if (!DealService.instance) DealService.instance = new DealService()
    return DealService.instance
  }

  async fetchDeals(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const dealService = DealService.getInstance()
