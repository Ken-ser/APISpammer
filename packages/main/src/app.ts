import autocannon, { Client, Result } from 'autocannon';

const hostname = ``
const path = `/main/v1/series/search/advanced`
const zipakiQueryParams = `?limit=24`
const res: string[] = [];

const setupClient = (client: Client) => {
    client.setBody(JSON.stringify(
        {
            sort: {
                field: "popularity",
                direction: "asc"
            },
            filter: {
                title: "bers"
            }
        }
    ));
};

const test = autocannon({
    title: 'Facciamo scoppiare la Zipaki search: ',
    url: `${hostname}${path}${zipakiQueryParams}`,
    method: 'POST',
    connections: 10,            // concurrent connections. OPTIONAL default: 10
    amount: 10,                 // number of requests to make before ending the test
    //connectionRate: 2,        // rate of requests from each individual connection. OPTIONAL
    //overallRate: 2,           // rate of requests from all connections. OPTIONAL
    //timeout: 10,              // The number of seconds to wait for a response. OPTIONAL default: 10
    setupClient
}, (err, result) => {
    if (err)
        console.log('error', err);
    handleResults(result);
})
// results passed to the callback are the same as those emitted from the done events
test.on('tick', () => console.log('ticking'))

test.on('response', handleResponse)

function handleResponse(_client: Client, statusCode: number, responseTime: number) {
    res.push(`Code ${statusCode} in ${responseTime} ms`)
}

function handleResults(result: Result) {
    console.log('Replies', res);
    console.log('Result', result);
}

autocannon.track(test, { renderLatencyTable: true });