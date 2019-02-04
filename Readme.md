# NATS services checker

### Description

Once we've faced some issues with `nats` instances that connect but do not reply/fail/go down.
To avoid problems we decided to make this prototype of nats services checker.

### How it works:

1) Application Server starts. It creates a list of instances that are connected to server.
2) Client connects. Client and server exchanges messages about established connection over NATS.
3) Server pings clients each second. If clients do not reply - we raise an error/process it at our server(send notification, reconnect, etc...)
4) If server do not request client more that 10 seconds - client is trying to reconnect/process messages too.


### How to run:

1) `npm install`
2) `node app.js`
3) `node client.js`
4) `node client2.js`
5) Try to stop app.js or any client. You will see behaviour 