const NATS = require('nats');
const natsServers = process.env.NATS_SERVERS;
let nats = NATS.connect({servers: natsServers});
let instances = {};

let joinTheme = "checker.join";

// setInterval(() => {
//     console.log(instances);
//     nats.publish('foo', 'Hello World!');
// }, 1000);
//
//
// // Simple Subscriber
// nats.subscribe('foo', function(msg) {
//     console.log('Received a message: ' + msg);
// });


// Scheme
// serviceName:String
// serviceHost:String
// serviceId:String


nats.subscribe(joinTheme, (msg, replyTo) => {
    let parsedData = JSON.parse(msg);
    console.log(`received serviceName: ${parsedData.serviceName} serviceHost: ${parsedData.serviceHost} serviceId: ${parsedData.serviceId}`)
    instances[parsedData.serviceId] = {
        serviceName: parsedData.serviceName,
        serviceHost: parsedData.serviceHost,
        serviceId: parsedData.serviceId
    };
    nats.publish(replyTo, "success")
});



// setTimeout(() => {
//
//     let str = JSON.stringify({
//         serviceName: "node-checker",
//         serviceHost: "localhost",
//         serviceId: "node_checker"
//     });
//
//     nats.request(joinTheme, str, {'max':1}, function(response) {
//         console.log('Subscribed: ' + response);
//     });
//
//     // nats.publish(joinTheme, JSON.stringify({
//     //     serviceName: "node-checker",
//     //     serviceHost: "localhost",
//     //     serviceId: "node_checker"
//     // }));
// }, 3000);


setInterval(() => {
    let keys = Object.keys(instances);
    console.log(keys);
    keys.forEach(key => {
        nats.requestOne(
            `checker.${instances[key].serviceId}`,
            "ping",
            {},
            10000,
            function(response) {
            if(response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
                console.log('Request for help timed out.');
                return;
            }
        });
    });
}, 1000);
