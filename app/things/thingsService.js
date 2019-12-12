import thingDAl from './thingsDAL';

class ThingsService {
    constructor() {}

    async getThingByBarcode(barcode) {
        if (!barcode) return new Error('error barcode');
        console.log('уровень service', barcode);
        return await thingDAl.getThingByBarcode(barcode);
    }

    async getThingByPid(pid) {
        if (!pid) return new Error('error barcode');
        console.log('уровень service', pid);
        return await thingDAl.getThingByPid(pid);
    }

    async getRecsByBarcode(barcode) {
        if (!barcode) return new Error('error barcode');
        return await thingDAl.getRecsByBarcode(barcode);
    }
}

const thingService = new ThingsService();

export default thingService;
