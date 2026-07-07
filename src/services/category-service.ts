import { BaseService } from './base.service'

export class CategoryService extends BaseService {
  fetchAllCategories({ first = 20, after = '' }: { first?: number; after?: string } = {}) {
    const query = `query Categories($first: Int!, $after: String) {
      categories(first: $first, after: $after) { edges { node { id name slug level } } pageInfo { hasNextPage endCursor } }
    }`
    return this.graphql(query, { first, after: after || null })
  }
  fetchCategory(id: string) {
    const query = `query Category($id: ID!) { category(id: $id) { id name slug description backgroundImage { url } } }`
    return this.graphql(query, { id })
  }
}
