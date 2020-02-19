import thingsController from "./thingsController";

/**
 * things url's
 * @param app
 */
module.exports = function (app) {
  app.get("/thing/barcode/:barcode", thingsController.thingByBarcode);
  app.get("/thing/ware/:ware", thingsController.thingByWare);
  app.get("/thingRecs/:barcode", thingsController.recsByBarcode);
};
