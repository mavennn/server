import catalogService from './catalogService';

class CatalogController {
    constructor() {}

    async getSubcategories(req, res, next) {
        const id = Number(req.params.id);
        const subcategories = await catalogService.getSubcategories(id);
        res.status(200).json(subcategories);
    }

    async getThings(req, res, next) {
        const id = Number(req.params.id);
        const things = await catalogService.getThings(id);
        res.status(200).json(things);
    }
}

const catalogController = new CatalogController();

export default catalogController;
