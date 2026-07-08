import { BaseService } from './base.service'

/**
 * GalleryService — Saleor connector. Methods mirror @misiki/litekart-connector's GalleryService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class GalleryService extends BaseService {
  private static instance: GalleryService
  static getInstance(): GalleryService {
    if (!GalleryService.instance) GalleryService.instance = new GalleryService()
    return GalleryService.instance
  }

  async fetchGallery(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const galleryService = GalleryService.getInstance()
