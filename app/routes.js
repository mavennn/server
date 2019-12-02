import thing from './controllers';

module.exports = function(app) {
    // ----- Достает полную ифну о шмотке
    app.get('/thing/:ware', thing.getThing);

    // ----- Достает список подкатегорий одной большой категории по parentId
    app.get('/categories/:parentId', thing.getCategoriesByParentId);

    // ----- Достает из бд информацию об отдельной категории
    app.get('/categoryInfo/:id', thing.getCategoryInfo);

    // ----- Достает все вещи какой-то категории по ее id
    app.get('/category/things/:id', thing.getThingsByCategory);

    // ----- Достает инфу о шмотке по PID
    app.get('/thing/pid/:pid', thing.getThingByPid);
};
