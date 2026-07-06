import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://store-45n964rn.saleor.cloud/graphql/');

const TOKEN_CREATE_MUTATION = `
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
    }
  }
`;

async function main() {
  try {
    const res = await client.request(TOKEN_CREATE_MUTATION, { email: "a@a.com", password: "pwd" });
    console.log(res);
  } catch (e) {
    console.error(e.response || e.message);
  }
}
main();
