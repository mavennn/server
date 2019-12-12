import thingsController from './thingsController';

module.exports = function(app) {
    app.get('/thing/barcode/:barcode', thingsController.thingByBarcode);
    app.get('/thing/pid/:pid', thingsController.thingByPid);
    app.get('/thingRecs/:barcode', thingsController.recsByBarcode);
};
