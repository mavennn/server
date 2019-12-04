import mongoose from 'mongoose';
import express from 'express';
import ip from 'ip';

const app = express();

require("./express")(app);
require("./routes")(app);
require("dotenv").config();

const queries = [];

require("./sockets/room")(app, queries);
require("./sockets/consultant")(app, queries);

function listen() {
  app.listen(3000);
  console.log(`Express app started on ${ip.address()}:3000`);
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
