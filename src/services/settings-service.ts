import { BaseService } from './base.service'

/**
 * SettingService — Saleor connector. Methods mirror @misiki/litekart-connector's SettingService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class SettingService extends BaseService {
  private static instance: SettingService
  static getInstance(): SettingService {
    if (!SettingService.instance) SettingService.instance = new SettingService()
    return SettingService.instance
  }

  async fetchSetting(..._args: any[]): Promise<any> { return this.dummy({}) }
  async saveSettings(..._args: any[]): Promise<any> { return this.dummy({}) }
  async updateSettings(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const settingsService = SettingService.getInstance()
