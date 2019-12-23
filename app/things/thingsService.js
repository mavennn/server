import thingDAl from './thingsDAL';

class ThingsService {
    constructor() {}

    async getThingByBarcode(barcode) {
        if (!barcode) return new Error('error barcode');
        return await thingDAl.getThingByBarcode(barcode);
    }

    async getThingByWare(ware) {
        if (!ware) return new Error('error ware');
        return await thingDAl.getThingByWare(ware);
    }

    async getRecsByBarcode(barcode) {
        if (!barcode) return new Error('error barcode');
        return await thingDAl.getRecsByBarcode(barcode);
    }
}

const thingService = new ThingsService();

export default thingService;
