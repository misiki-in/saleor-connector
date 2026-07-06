const { GraphQLClient } = require('graphql-request');

const client = new GraphQLClient('http://localhost:4000/graphql/'); // Wait, where is Saleor hosted?
