import mongoose from 'mongoose';
import express from 'express';
import ip from 'ip';

const app = express();
const server = require("http").createServer(app);

require("./express")(app);
require("./routes")(app);
require("dotenv").config();

const queries = [];

// require("./sockets/consultant")(app, queries);

function listen() {
  server.listen(3000, (err) => {
    if (err) console.log(err);
    console.log("server listening on 3000");
    require("./sockets/room")(server, queries);
  })
}

function connect() {
  mongoose.connection
    .on("error", console.log)
    .on("disconnected", connect)
    .once("open", listen);
  return mongoose.connect("mongodb://localhost:27017/sportmaster", { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("mongoDB connected");
  });
}

connect();
