import { GraphQLClient } from 'graphql-request';
const client = new GraphQLClient('https://store-45n964rn.saleor.cloud/graphql/', {
    requestMiddleware: (request) => {
        console.log("Original body:", request.body);
        return request;
    }
});
client.request(`query { __typename }`).catch(e => console.log(e.response || e));
