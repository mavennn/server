import thingService from './thingsService';

class ThingsController {
    constructor() {}

    async thingByBarcode(req, res, next) {
        const barcode = Number(req.params.barcode);
        let thing = await thingService.getThingByBarcode(barcode);
        console.log('thing', thing);
        res.status(200).json(thing);
    }

    async thingByWare(req, res, next) {
        const ware = req.params.ware;
        let thing = await thingService.getThingByWare(ware);
        console.log('thing', thing);
        res.status(200).json(thing);
    }

    async recsByBarcode(req, res, next) {
        const barcode = Number(req.params.barcode);
        let recs = await thingService.getRecsByBarcode(barcode);
        console.log('recs', recs);
        res.status(200).json(recs);
    }
}

const thingsController = new ThingsController();

export default thingsController;
