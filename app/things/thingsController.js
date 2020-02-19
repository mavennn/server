import thingService from "./thingsService";

/**
 * Things Controller
 * containt controllers for things
 */
class ThingsController {

  /**
   * thingByBarcode
   * get thing by barcode
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  async thingByBarcode(req, res, next) {
    const barcode = Number(req.params.barcode);
    const thing = await thingService.getThingByBarcode(barcode);
    console.log("thing", thing);
    res.status(200).json(thing);
  }

  /**
   * thingByWare
   * get thing by ware
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  async thingByWare(req, res, next) {
    const { ware } = req.params;
    const thing = await thingService.getThingByWare(ware);
    console.log("thing", thing);
    res.status(200).json(thing);
  }

  /**
   * recsByBarcode
   * get array of recs by thing's barcode
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  async recsByBarcode(req, res, next) {
    const barcode = Number(req.params.barcode);
    const recs = await thingService.getRecsByBarcode(barcode);
    console.log("recs", recs);
    res.status(200).json(recs);
  }
}

const thingsController = new ThingsController();

export default thingsController;
