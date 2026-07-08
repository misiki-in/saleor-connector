import { BaseService } from './base.service'

/**
 * SearchService — Saleor connector. Methods mirror @misiki/litekart-connector's SearchService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class SearchService extends BaseService {
  private static instance: SearchService
  static getInstance(): SearchService {
    if (!SearchService.instance) SearchService.instance = new SearchService()
    return SearchService.instance
  }

  async searchWithUrl(..._args: any[]): Promise<any> { return this.emptyPage() }
  async searchWithQuery(..._args: any[]): Promise<any> { return this.emptyPage() }
  async emptyResult(..._args: any[]): Promise<any> { return { data: [], count: 0, pageSize: 0, noOfPage: 0, page: 1 } }
}

export const searchService = SearchService.getInstance()
