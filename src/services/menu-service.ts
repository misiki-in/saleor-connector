import { BaseService } from './base.service'

/**
 * MenuService — Saleor connector. Methods mirror @misiki/litekart-connector's MenuService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class MenuService extends BaseService {
  private static instance: MenuService
  static getInstance(): MenuService {
    if (!MenuService.instance) MenuService.instance = new MenuService()
    return MenuService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const menuService = MenuService.getInstance()
