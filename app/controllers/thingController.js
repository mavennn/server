const { empty, erJson, suJson, uniq, uniqByName } = require('../helpers');
const Thing = require('../models/thing');
const Category = require('../models/category');


// ----- Полная инфа о шмотке по ware
// ----- на вход /thing/ware/:ware
exports.getThingByWare = async (req, res, next) => {
  if (empty(req)) return req.status(404).json(erJson("Not found"));
  const ware = req.params.ware;
  let thing = await Thing.findOne({ ware });
  if (empty(thing)) return res.status(404).json(erJson("Not found"));
  res.status(200).json(suJson(thing));
  next();
};

// достает все шмотки одной категории в формате
// на вход /things/by/:categoryId
exports.getThingsInfoByCategoryId = async (req, res, next) => {
  if(empty(req)) return res.status(404).json(erJson("Not found"));
  const categoryId = Number(req.params.categoryId);
  let things = await Thing.find({ categories: categoryId }, { name: 1, pid: 1, ware: 1, pictures: 1, _id: 0 });
  if (empty(things)) return res.status(404).json(erJson("Not found"));
  let t = things.map((x) => {
    return {
      name: x.name,
      image: x.pictures[0],
      pid: x.pid,
      ware: x.ware
    }
  });

  let ress = uniqByName(t);

  // things = [
  //   {
  //     pictures: [...],
  //     ware: String,
  //     pid: Number,
  //     name: String,
  //   },
  //   {
  //     pictures: [...],
  //     ware: String,
  //     pid: Number,
  //     name: String,
  //   }
  // ]
  res.status(200).json(suJson(ress));
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

// ----- Неполная информация о вещи по pid
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
  // {
  //     "type": "Success",
  //   "data": {
  //     "picture": "https://cdn.sptmr.ru/upload/iblock/70f/21200880299.jpg",
  //       "name": "Туфли для девочек Skechers GO run 600 - Jazzy Stride",
  //       "pid": 10439894,
  //       "ware": "82017LHP11"
  // }
  // }
  next();
};
