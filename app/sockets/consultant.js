const sockets = require("../constants/sockets");

module.exports = function (app, queries) {
  const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  const consultants = io.of(sockets.CONSULTANTS);

  consultants.on("connection", (consultant) => {
    console.log(`Consultant ${consultant.handshake.address}`);

    consultant.on("giveMeQueries", () => {
      consultant.emit("giveYouQueries", queries);
    });

    consultant.on("takeInWork", (query) => {
      const name = query.consultantName;
      delete query.consultantName;
      const index = _.findIndex(queries, query);
      queries[index].inProcessing = true;
      queries[index].consultantName = name;
      console.log(queries[index]);
      consultants.emit("getQueries", queries);
    });

    consultant.on("completed", (query) => {
      const index = _.findIndex(queries, query);
      queries.splice(index, 1);
      consultants.emit("getQueries", queries);
    });

    consultants.on("disconnect", () => console.log(`Consultant ${consultant.handshake.address} disconnected`));
  });
};
