import { GraphQLClient } from 'graphql-request';
const client = new GraphQLClient('https://store-45n964rn.saleor.cloud/graphql/', {
    requestMiddleware: (request) => {
        console.log("Middleware request keys:", Object.keys(request));
        request.headers = {
            ...request.headers,
            authorization: `Bearer token`
        };
        return request;
    }
});
client.request(`query { __typename }`).catch(e => console.error(e.response || e));
