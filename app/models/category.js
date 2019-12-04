const mongoose = require('mongoose');

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: String,
    id: Number,
    parentId: Number,
  }),
);

module.exports = Category;
