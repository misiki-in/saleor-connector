const https = require('https');

const data = JSON.stringify({
  query: `
    query {
      __type(name: "Mutation") {
        fields {
          name
          args {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  `
});

const options = {
  hostname: 'demo.saleor.io',
  path: '/graphql/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    const fields = json.data.__type.fields;
    const accountRegister = fields.find(f => f.name === 'accountRegister');
    console.log(JSON.stringify(accountRegister, null, 2));
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
