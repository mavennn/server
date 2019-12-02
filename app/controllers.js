import { empty, erJson, suJson, uniq } from './helpers';
import Thing from './models/thing';
import Category from './models/category';


// ----- Достает полную ифну о шмотке
exports.getThing = async (req, res, next) => {
  if (empty(req)) return req.status(404).json(erJson("Not found"));

  const ware = req.params.ware;
  let thing = await Thing.findOne({ ware });

  if (empty(thing)) return res.status(404).json(erJson("Not found"));

  res.status(200).json(suJson(thing));
  next();
};

// ----- Достает из бд информацию об отдельной категории
exports.getCategoryInfo = async (req, res, next) => {
  if (empty(req)) return req.status(404).json(erJson("Not found"));

  const id = Number(req.params.id);
  let category = await Category.findOne({ id }, {name: 1, id: 1, _id: 0});
  if (empty(category)) return res.status(404).json(erJson("Not found"));

  res.status(200).json(suJson(category));
  next();
};

// ----- Достает список подкатегорий одной большой категории по parentId
exports.getCategoriesByParentId = async (req, res, next) => {
  if (empty(req)) return req.status(404).json(erJson("Not found"));

  const parentId = Number(req.params.parentId);
  let categories = await Category.find({ parentId }, { id: 1, _id: 0 });
  categories = categories.map(x => x.id);
  if (empty(categories)) return res.status(404).json(erJson("Not found"));

  res.status(200).json(suJson(categories));
  next();
};

// ----- Достает все вещи какой-то категории по ее id
exports.getThingsByCategory = async (req, res, next) => {
  if (empty(req)) return req.status(404).json(erJson("Not found"));

  const categoryId = Number(req.params.id);
  let things = await Thing.find({ categories: categoryId }, { pid: 1, _id: 0 });
  things = things.map(x => x.pid);
  if (empty(things)) return res.status(404).json(erJson("Not found"));

  res.status(200).json(suJson(uniq(things)));
  next();
};

exports.getThingByPid = async (req, res, next) => {
  if (empty(req)) return req.status(404).json(erJson("Not found"));

  const pid = Number(req.params.pid);
  let thing = await Thing.findOne({ pid });
  thing = {
    picture: thing.pictures[0],
    name: thing.name,
    pid: thing.pid,
    ware: thing.ware
  };

  if (empty(thing)) return res.status(404).json(erJson("Not found"));
  res.status(200).json(suJson((thing)));
  next();
};
