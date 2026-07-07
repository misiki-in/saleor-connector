import { BaseService } from './base.service'

export class SearchService extends BaseService {
  searchWithQuery(query: string, channel = 'default-channel') {
    const gql = `query Search($q: String!, $channel: String!) {
      products(first: 20, filter: { search: $q }, channel: $channel) { edges { node { id name slug } } }
    }`
    return this.graphql(gql, { q: query, channel })
  }
}
