import { BaseService } from './base.service'

/**
 * StateService — Saleor connector. Methods mirror @misiki/litekart-connector's StateService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class StateService extends BaseService {
  private static instance: StateService
  static getInstance(): StateService {
    if (!StateService.instance) StateService.instance = new StateService()
    return StateService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const stateService = StateService.getInstance()
