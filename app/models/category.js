import mongoose from 'mongoose';

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

export default Category;
