const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Env = require('./config/env').Env;
const env = new Env;
const cors = require('cors');
const bodyParser = require('body-parser');
const ip = require('ip');
const thingsRoutes = require('./routes/things');
const sockets = require('./constants/sockets.json');
const _ = require('lodash');

const PORT = env.getServerPort();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('./public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  next();
});

app.get('/getThing/:barcode', thingsRoutes.getThingByBarcode);

let queries = [];

const consultants = io.of(sockets.CONSULTANTS);

const rooms = io.of(sockets.ROOMS);

consultants.on('connection', (consultant) => {
  console.log(`Consultant ${consultant.handshake.address}`);

  consultant.on('giveMeQueries', () => {
    consultant.emit('giveYouQueries', queries);
  });

  consultant.on('takeInWork', query => {
    const name = query.consultantName;
    delete query.consultantName;
    const index = _.findIndex(queries, query);
    queries[index].inProcessing = true;
    queries[index].consultantName = name;
    console.log(queries[index]);
    consultants.emit('getQueries', queries);
  });

  consultant.on('completed', (query) => {
    const index = _.findIndex(queries, query);
    queries.splice(index, 1);
    consultants.emit('getQueries', queries);
  });

  consultants.on('disconnect', () => console.log(`Consultant ${consultant.handshake.address} disconnected`));
});

rooms.on('connection', (room) => {

  room.on('newRoomConnection', (roomNumber) => {
    console.log(`Room ${roomNumber} connected`);
  });

  room.on('getConsultant', (query) => {
    if (_.find(queries, query) === undefined) {
      queries.push(query);
      consultants.emit('getQueries', queries);
    }
    console.log(queries.length);
  });

  room.on('clearRoom', (roomNumber) => {
     queries = queries.filter(query => query.room != roomNumber);
     console.log(queries);
  });

  room.on('roomDisconnected', (roomNumber) => {
    console.log(`Room ${roomNumber} disconnected`);
  });

  room.on('disconnect', () => console.log(`Room ${room.handshake.address} disconnected`));
});

server.listen(PORT, () => {
  console.log(`Listening on ${ip.address()}:${PORT}`);
});
