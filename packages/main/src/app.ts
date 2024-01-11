import autocannon, { Client } from 'autocannon';

const setupClient = (client: Client) => {
  client.setBody(JSON.stringify({
        
  }));
};

const test = autocannon({
  title: 'Facciamo scoppiare la Zipaki search:',
  url: '',
  method: 'POST',
  connections: 10,
  amount: 200,
  //overallRate: 2,
  requests: [{
    path: '/main/graphql',
    headers: {
      'content-type': 'application/json'
    }
  }],
  setupClient
}, console.log);

autocannon.track(test, { renderLatencyTable: true });