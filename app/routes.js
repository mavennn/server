const thingController = require('./controllers/thingController');
const categoryController = require('./controllers/categoryController');

module.exports = function(app) {
    // ----- Полная информация о вещи
    // ----- для отображения на главной страницы зеркала
    app.get('/thing/ware/:ware', thingController.getThingByWare);
/*-----------------------------------------------------------------------------*/
    // ----- Достает инфу о шмотке по PID
    // ----- Для отображения карточки товара
    app.get('/thing/pid/:pid', thingController.getThingByPid);
    // {
    //     "type": "Success",
    //   "data": {
    //     "picture": "https://cdn.sptmr.ru/upload/iblock/70f/21200880299.jpg",
    //       "name": "Туфли для девочек Skechers GO run 600 - Jazzy Stride",
    //       "pid": 10439894,
    //       "ware": "82017LHP11"
    // }
    // }
/*-----------------------------------------------------------------------------*/
    // ----- Массив подкатегорий одной большой категории по parentId
    app.get('/categories/:parentId', thingController.getCategoriesByParentId);
/*-----------------------------------------------------------------------------*/
    // ----- Объект об отдельной категории
    // ----- Дляы
    app.get('/category/:id/info', categoryController.getCategoryInfo);
    // {
    //     "type": "Success",
    //   "data": {
    //     "name": "Сандалии",
    //       "id": 21665
    // }
    // }
/*-----------------------------------------------------------------------------*/
    // ----- Массив шмоток одной категории
    // ----- Для Третьего уровня каталога, где уже все шмотки отображаются
    app.get('/things/by/:categoryId', thingController.getThingsInfoByCategoryId);
/*-----------------------------------------------------------------------------*/
    // ----- Массив подкатегорий
    app.get('/category/:id/subcategories', categoryController.getSubcategories);
    // {
    //     "type": "Success",
    //   "data": [
    //     {
    //         "name": "Костюмы",
    //         "id": 21608
    //     },
    //     {
    //         "name": "Рубашки",
    //         "id": 21607
    //     },
    // }
};
