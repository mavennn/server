import catalogController from './catalogController';

module.exports = function(app) {
  app.get('/category/:id/subcategories', catalogController.getSubcategories);
  app.get('/category/:id/things', catalogController.getThings);
};
