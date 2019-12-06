const { empty, erJson, suJson, uniq } = require('../helpers');
const Category = require('../models/category');


// ----- Достает из бд информацию об отдельной категории
exports.getCategoryInfo = async (req, res, next) => {
  if (empty(req)) return res.status(404).json(erJson("Not found"));
  const id = Number(req.params.id);
  let category = await Category.findOne({ id }, {name: 1, id: 1, _id: 0});
  if (empty(category)) return res.status(404).json(erJson("Not found"));
  res.status(200).json(suJson(category));
  next();
};

// ----- Информация о всех подкатегориях
exports.getSubcategories = async (req, res, next) => {
  if (empty(req)) return res.status(404).json(erJson("Not found"));
  const categoryId = Number(req.params.id);
  let categories = await Category.find({ parentId: categoryId }, { name: 1, id: 1, _id: 0 });
  if (empty(categories)) return res.status(404).json(erJson("No such categories"));
  res.status(200).json(suJson(categories));
  next();
};
