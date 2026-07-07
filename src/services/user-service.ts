import { BaseService } from './base.service'

export class UserService extends BaseService {
  getMe() {
    const query = `query Me { me { id email firstName lastName } }`
    return this.graphql(query)
  }
}
