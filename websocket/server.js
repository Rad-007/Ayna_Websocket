const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

// Open a database connection
let db = new sqlite3.Database('./chat.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chat database.');
});

// Create a table for messages if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS messages(content TEXT)', (err) => {
  if (err) {
    console.error(err.message);
  }
});

const server = http.createServer((req, res) => {
  fs.readFile('./index.html', null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write('File not found!');
    } else {
      res.write(data);
    }
    res.end();
  });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log('Received: %s', message);
    ws.send(message); // Echo back the message

    // Store the message in the database
    db.run(`INSERT INTO messages(content) VALUES(?)`, [message], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  });
});

server.listen(8080);