const mongoose = require("mongoose");
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL;

mongoose.connect('mongodb://localhost:27017/sportmaster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw new Error(err);
  console.log("MongoDB connected!")
});

module.exports = mongoose;
