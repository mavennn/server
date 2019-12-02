import mongoose from 'mongoose';

const Thing = mongoose.model(
  "Thing",
  new mongoose.Schema({
    id: Number,
    pid: Number,
    ware: String,
    available: Boolean,
    name: String,
    price: String,
    size: String,
    color: String,
    brand: String,
    description: String,
    categories: [Number],
    pictures: [String],
    params: [Object],
  }),
);

export default Thing;
