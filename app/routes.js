
const thing = require('../app/controllers');

module.exports = function (app) {
  app.get("/thing/:ware", thing.getThing);
};
