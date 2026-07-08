import { BaseService } from './base.service'

/**
 * ReelsService — Saleor connector. Methods mirror @misiki/litekart-connector's ReelsService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class ReelsService extends BaseService {
  private static instance: ReelsService
  static getInstance(): ReelsService {
    if (!ReelsService.instance) ReelsService.instance = new ReelsService()
    return ReelsService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const reelsService = ReelsService.getInstance()
