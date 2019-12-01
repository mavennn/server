const mongoose = require('mongoose');
const app = require("express")();


const ip = require("ip");
const _ = require("lodash");

const port = process.env.SERVER_PORT || 3000;

require('./express')(app);
require('./routes')(app);
require('dotenv').config();

let queries = [];

require('./sockets/room')(app, queries);
require('./sockets/consultant')(app, queries);

function listen() {
  app.listen(port);
  console.log('Express app started on port ' + port);
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect("mongodb://localhost:27017/sportmaster", { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true });
}

connect();
