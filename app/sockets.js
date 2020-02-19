const sockets = require("./constants/sockets");

/**
 * Socket module
 * @param io
 */
module.exports = function (io) {
  const _ = require("underscore");

  let queries = [];

  const tokens = [];

  const consultants = io.of(sockets.CONSULTANTS);

  const rooms = io.of(sockets.ROOMS);

  /* --------- Sockets for consultant --------*/
  consultants.on("connection", (consultant) => {
    console.log(`Consultant ${consultant.handshake.address}`);

    // При подключении конслультанта ему отправляется текущий массив заявок
    consultant.on("giveMeQueries", () => {
      console.log("giveMeQueries", queries);
      consultant.emit("giveYouQueries", queries);
    });

    // When consultant swipe query right
    consultant.on("takeInWork", (query) => {
      const name = query.consultantName;
      delete query.consultantName;
      const index = _.findIndex(queries, query);
      queries[index].inProcessing = true;
      queries[index].consultantName = name;
      console.log("takeInWork", queries);
      consultants.emit("getQueries", queries);
    });

    // Когда консультант завершил запрос
    consultant.on("completed", (query) => {
      const index = _.findIndex(queries, query);
      queries.splice(index, 1);
      console.log("completed", queries);
      consultants.emit("getQueries", queries);
    });

    // пока не работает
    // consultant.on("sendScannedWare", async (ware) => {
    //   let thing = await Thing.findOne({ ware }).catch(err => console.log(err));
    //   console.log(thing);
    // });

    // получение токена констультанта для уведомлений
    consultant.on("getAppToken", (token) => {
      tokens.push(token);
      console.log("tokens", tokens);
    });

    // отключение консультанта
    consultant.on("disconnect", () => console.log(
      `Consultant ${consultant.handshake.address} disconnected`,
    ));
  });

  /* --------- Сокеты для зеркала ---------*/
  rooms.on("connection", (room) => {
    console.log(`Room ${room.handshake.address} connected`);

    // вызывает консультанта
    room.on("getConsultant", (query) => {
      if (_.find(queries, query) === undefined) {
        queries.push(query);
        console.log(queries);
        consultants.emit("getQueries", queries);
      }
      console.log(queries.length);
    });

    // сбрасывает параметры комнаты
    room.on("clearRoom", (roomNumber) => {
      queries = queries.filter((query) => query.room !== roomNumber);
      console.log(queries);
    });

    room.on("disconnect", () => console.log(`Room ${room.handshake.address} disconnected`));
  });
};
