const NATS = require('nats');
const natsServers = process.env.NATS_SERVERS;
let nats = NATS.connect({servers: natsServers});

let joinTheme = "checker.join";

let lastPing = null;

let config = {
    serviceName: "node-checker",
    serviceHost: "localhost",
    serviceId: "node_checker"
};

let str = JSON.stringify(config);

setTimeout(() => {
    reconnect();

    nats.subscribe(`checker.${config.serviceId}`, function(request, replyTo) {
        nats.publish(replyTo, 'pong');
        lastPing = new Date();
    });
}, 3000);


setInterval(() => {
    console.log(lastPing);
    let now = new Date().getTime();
    if (lastPing !== null) {
        if (now - lastPing.getTime() > 10000) {
            console.log("There is a connection error!");
            reconnect();
        }
    }
}, 1000);

let reconnect = () => {
    nats.request(joinTheme, str, {'max': 1}, function(response) {
        console.log('Subscribed: ' + response);
        lastPing = new Date();
    });
};