import { BaseService } from './base.service'

export class OrderService extends BaseService {
  list({ first = 20, after = '' }: { first?: number; after?: string } = {}) {
    const query = `query Orders($first: Int!, $after: String) {
      orders(first: $first, after: $after) { edges { node { id number created status total { gross { amount currency } } } } pageInfo { hasNextPage endCursor } }
    }`
    return this.graphql(query, { first, after: after || null })
  }
  fetchOrder(id: string) {
    const query = `query Order($id: ID!) { order(id: $id) { id number status total { gross { amount currency } } lines { productName quantity } } }`
    return this.graphql(query, { id })
  }
}
