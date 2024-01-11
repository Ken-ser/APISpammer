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
                title: "be",
                categories: ["8d9fbd22-9d54-410d-bb49-581f93efdf23"]
            }
        }
    ));
    client.setHeaders({
        "content-type": 'application/json'
    })
    client.on('response', handleResponse)
};

const test = autocannon({
    title: 'Facciamo scoppiare la Zipaki search: ',
    url: `${hostname}${path}${zipakiQueryParams}`,
    method: 'POST',
    connections: 20,            // concurrent connections. OPTIONAL default: 10
    amount: 20,                 // number of requests to make before ending the test
    //connectionRate: 2,        // rate of requests from each individual connection. OPTIONAL
    //overallRate: 2,           // rate of requests from all connections. OPTIONAL
    //timeout: 10,              // The number of seconds to wait for a response. OPTIONAL default: 10
    setupClient
}, (err, result) => {
    if (err)
        console.log('error', err);
    handleResults(result);
})

function handleResponse(statusCode: number, _resBytes: number, responseTime: number) {
    res.push(`Code ${statusCode} in ${responseTime.toFixed()} ms`)
}

function extractMs(str: string) {
    let match = str.match(/(\d+) ms/);
    return match ? parseInt(match[1]!, 10) : null;
}

function handleResults(result: Result) {
    // Sort the array based on the extracted milliseconds
    res.sort((a, b) => {
        return extractMs(a)! - extractMs(b)!;
    });

    console.log('Replies', res);
    console.log('Result', {
        //title: result.title,
        url: result.url,
        //socketPath: result.socketPath,
        connections: result.connections,
        pipelining: result.pipelining,
        duration: result.duration,
        //start: result.start,
        //finish: result.finish,
        errors: result.errors,
        timeouts: result.timeouts,
        //mismatches: result.mismatches,
        //non2xx: result.non2xx,
        resets: result.resets,
        //'1xx': result['1xx'],
        //'2xx': result['2xx'],
        '3xx': result['3xx'],
        '4xx': result['4xx'],
        '5xx': result['5xx'],
        statusCodeStats: result.statusCodeStats,
        //latency: result.latency,
        //requests: result.requests,
        //throughput: result.throughput,
    });
}

autocannon.track(test, { renderLatencyTable: true });