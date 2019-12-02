import thing from './controllers';

module.exports = function (app) {
  app.get("/thing/:ware", thing.getThing);

  app.get("/categories/:parentId", thing.getCategoriesByParentId);

  app.get("/categoryInfo/:id", thing.getCategoryInfo)

  app.get("/thing/category/:id", thing.getThingsByCategory)
};
