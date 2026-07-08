import { BaseService } from './base.service'

/**
 * CollectionService — Saleor connector. Methods mirror @misiki/litekart-connector's CollectionService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class CollectionService extends BaseService {
  private static instance: CollectionService
  static getInstance(): CollectionService {
    if (!CollectionService.instance) CollectionService.instance = new CollectionService()
    return CollectionService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
  async getOne(..._args: any[]): Promise<any> { return this.dummy({}) }
  async getAllRatings(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const collectionService = CollectionService.getInstance()
