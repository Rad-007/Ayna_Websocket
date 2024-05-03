// In your client file
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  ws.send('Hello Server!');
});

ws.on('message', function incoming(data) {
  console.log('Received: %s', data);
});