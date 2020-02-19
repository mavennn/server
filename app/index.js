const express = require("express");
const ip = require("ip").address();

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const config = require("./config");

require("./express")(app);
require("./things/thingsRoutes")(app);
require("./catalog/catalogRoutes")(app);

function listen() {
  server.listen(config.server.port, (err) => {
    if (err) console.log(err);
    console.log(`server listening on ${ip}:${config.server.port}`);
    require("./sockets")(io);
  });
}

listen();
