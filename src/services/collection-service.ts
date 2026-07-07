import { BaseService } from './base.service'

export class CollectionService extends BaseService {
  list({ first = 20, after = '', channel = 'default-channel' }: { first?: number; after?: string; channel?: string } = {}) {
    const query = `query Collections($first: Int!, $after: String, $channel: String!) {
      collections(first: $first, after: $after, channel: $channel) { edges { node { id name slug } } pageInfo { hasNextPage endCursor } }
    }`
    return this.graphql(query, { first, after: after || null, channel })
  }
}
