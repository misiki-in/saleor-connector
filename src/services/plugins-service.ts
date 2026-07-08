import { BaseService } from './base.service'

/**
 * PluginService — Saleor connector. Methods mirror @misiki/litekart-connector's PluginService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class PluginService extends BaseService {
  private static instance: PluginService
  static getInstance(): PluginService {
    if (!PluginService.instance) PluginService.instance = new PluginService()
    return PluginService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const pluginsService = PluginService.getInstance()
