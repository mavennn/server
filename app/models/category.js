const mongoose = require('../mongoose');

const Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: String,
    id: Number,
    parentId: {
      type: Number,
      required: false,
    },
  }),
);

module.exports = Category;
