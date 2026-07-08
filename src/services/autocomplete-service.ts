import { BaseService } from './base.service'

/**
 * AutocompleteService — Saleor connector. Methods mirror @misiki/litekart-connector's AutocompleteService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class AutocompleteService extends BaseService {
  private static instance: AutocompleteService
  static getInstance(): AutocompleteService {
    if (!AutocompleteService.instance) AutocompleteService.instance = new AutocompleteService()
    return AutocompleteService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const autocompleteService = AutocompleteService.getInstance()
