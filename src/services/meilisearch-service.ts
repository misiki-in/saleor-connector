import { BaseService } from './base.service'

/**
 * MeilisearchService — Saleor connector. Methods mirror @misiki/litekart-connector's MeilisearchService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class MeilisearchService extends BaseService {
  private static instance: MeilisearchService
  static getInstance(): MeilisearchService {
    if (!MeilisearchService.instance) MeilisearchService.instance = new MeilisearchService()
    return MeilisearchService.instance
  }

  async search(..._args: any[]): Promise<any> { return this.emptyPage() }
  async searchAutoComplete(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const meilisearchService = MeilisearchService.getInstance()
