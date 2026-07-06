import { GraphQLClient } from 'graphql-request';
const client = new GraphQLClient('https://store-45n964rn.saleor.cloud/graphql/', {
    requestMiddleware: (request) => {
        if (request.headers instanceof Headers) {
           request.headers.set('authorization', 'Bearer x');
        } else {
           request.headers = { ...request.headers as any, authorization: 'Bearer x' };
        }
        return request;
    }
});
client.request(`query { __typename }`).then(console.log).catch(e => console.log(e.response || e));
