import { BaseService } from './base.service'

export class ProductService extends BaseService {
  list({ first = 20, after = '', channel = 'default-channel' }: { first?: number; after?: string; channel?: string } = {}) {
    const query = `query Products($first: Int!, $after: String, $channel: String!) {
      products(first: $first, after: $after, channel: $channel) {
        edges { node { id name slug thumbnail { url } pricing { priceRange { start { gross { amount currency } } } } } }
        pageInfo { hasNextPage endCursor }
      }
    }`
    return this.graphql(query, { first, after: after || null, channel })
  }
  getOne(slug: string, channel = 'default-channel') {
    const query = `query Product($slug: String!, $channel: String!) {
      product(slug: $slug, channel: $channel) { id name slug description media { url } category { id name }
        variants { id name quantityAvailable pricing { price { gross { amount currency } } } } }
    }`
    return this.graphql(query, { slug, channel })
  }
}
