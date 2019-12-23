import thingsController from './thingsController';

module.exports = function(app) {
    app.get('/thing/barcode/:barcode', thingsController.thingByBarcode);
    app.get('/thing/ware/:ware', thingsController.thingByWare);
    app.get('/thingRecs/:barcode', thingsController.recsByBarcode);
};
