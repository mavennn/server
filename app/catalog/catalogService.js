import catalogDAL from "./catalogDAL";

class CatalogService {
    constructor() {}

    async getSubcategories (id) {
      return await catalogDAL.subcategories(id);
    }

    async getThings (id) {
      return await catalogDAL.things(id);
    }
}

const catalogService = new CatalogService();

export default catalogService;
