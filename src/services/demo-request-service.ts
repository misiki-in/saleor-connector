import { BaseService } from './base.service'

/**
 * DemoRequestService — Saleor connector. Methods mirror @misiki/litekart-connector's DemoRequestService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class DemoRequestService extends BaseService {
  private static instance: DemoRequestService
  static getInstance(): DemoRequestService {
    if (!DemoRequestService.instance) DemoRequestService.instance = new DemoRequestService()
    return DemoRequestService.instance
  }

  async saveScheduleDemo(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const demoRequestService = DemoRequestService.getInstance()
