import { BaseService } from './base.service'

/**
 * StoreService — Saleor connector. Methods mirror @misiki/litekart-connector's StoreService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class StoreService extends BaseService {
  private static instance: StoreService
  static getInstance(): StoreService {
    if (!StoreService.instance) StoreService.instance = new StoreService()
    return StoreService.instance
  }

  async getStoreByIdOrDomain(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const storeService = StoreService.getInstance()
