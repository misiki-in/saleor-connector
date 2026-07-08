import { BaseService } from './base.service'

/**
 * UploadService — Saleor connector. Methods mirror @misiki/litekart-connector's UploadService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class UploadService extends BaseService {
  private static instance: UploadService
  static getInstance(): UploadService {
    if (!UploadService.instance) UploadService.instance = new UploadService()
    return UploadService.instance
  }

  async uploadToS3(..._args: any[]): Promise<any> { return this.dummy({}) }
  async uploadMultipleToS3(..._args: any[]): Promise<any> { return this.dummy({}) }
  async deleteFromS3(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const uploadService = UploadService.getInstance()
