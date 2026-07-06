import { GraphQLClient } from 'graphql-request';
const client = new GraphQLClient('https://store-45n964rn.saleor.cloud/graphql/', {
    requestMiddleware: (request) => {
        console.log("Headers type:", request.headers?.constructor?.name);
        return request;
    }
});
client.request(`query { __typename }`).catch(e => e);
