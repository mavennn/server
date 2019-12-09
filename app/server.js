const mongoose = require('mongoose');
const express = require('express');
const ip = require('ip').address();
const { PORT, MONGO_URL } = require('./config');

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

require("./express")(app);
require("./routes")(app);

function listen() {
  server.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`server listening on ${ip}:${PORT}`);
    require("./sockets")(io);
  })
}

function connect() {
  mongoose.connection
    .on("error", console.log)
    .on("disconnected", connect)
    .once("open", listen);
  return mongoose.connect(MONGO_URL, { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("mongoDB connected");
  });
}

connect();
