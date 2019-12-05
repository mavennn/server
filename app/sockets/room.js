const sockets = require("../constants/sockets");


module.exports = function (server, queries) {
  // const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  const rooms = io.of(sockets.ROOMS);

  rooms.on("connection", (room) => {
    room.on("newRoomConnection", (roomNumber) => {
      console.log(`Room ${roomNumber} connected`);
    });

    room.on("getConsultant", (query) => {
      if (_.find(queries, query) === undefined) {
        queries.push(query);
        consultants.emit("getQueries", queries);
      }
      console.log(queries.length);
    });

    room.on("clearRoom", (roomNumber) => {
      queries = queries.filter((query) => query.room !== roomNumber);
      console.log(queries);
    });

    room.on("roomDisconnected", (roomNumber) => {
      console.log(`Room ${roomNumber} disconnected`);
    });

    room.on("disconnect", () => console.log(`Room ${room.handshake.address} disconnected`));
  });
};
