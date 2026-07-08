import { BaseService } from './base.service'

/**
 * AddressService — Saleor connector. Methods mirror @misiki/litekart-connector's AddressService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class AddressService extends BaseService {
  private static instance: AddressService
  static getInstance(): AddressService {
    if (!AddressService.instance) AddressService.instance = new AddressService()
    return AddressService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
  async fetchAddress(..._args: any[]): Promise<any> { return this.emptyPage() }
  async saveAddress(..._args: any[]): Promise<any> { return this.dummy({}) }
  async editAddress(..._args: any[]): Promise<any> { return this.dummy({}) }
  async deleteAddress(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const addressService = AddressService.getInstance()
