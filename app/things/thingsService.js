import thingDAl from "./thingsDAL";

/**
 * Thing Service Layer
 * Containt Thing's business logic
 */
class ThingsService {

  /**
   * getThingByBarcode
   * @param {string} barcode - barcode of thing
   * @returns {Promise<Error|*|undefined>}
   */
  async getThingByBarcode(barcode) {
    if (!barcode) return new Error("error barcode");
    return await thingDAl.getThingByBarcode(barcode);
  }

  /**
   * getThingByWare
   * @param {string} ware - ware of thing
   * @returns {Promise<Error|*|undefined>}
   */
  async getThingByWare(ware) {
    if (!ware) return new Error("error ware");
    return await thingDAl.getThingByWare(ware);
  }

  /**
   * getRecsByBarcode
   * @param {string} barcode
   * @returns {Promise<Error|*>}
   */
  async getRecsByBarcode(barcode) {
    if (!barcode) return new Error("error barcode");
    return await thingDAl.getRecsByBarcode(barcode);
  }
}

const thingService = new ThingsService();

export default thingService;
