import { GraphQLClient } from 'graphql-request';
const client = new GraphQLClient('https://store-45n964rn.saleor.cloud/graphql/', {
    requestMiddleware: (request) => {
        // Without mutating it works?
        console.log("Original body:", typeof request.body);
        request.headers = { ...request.headers as any, authorization: `Bearer x` };
        return request;
    }
});
client.request(`query { __typename }`).then(console.log).catch(e => console.log(e.response || e));
