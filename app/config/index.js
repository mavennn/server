require('dotenv').config();

module.exports = {
  database: {
    name: process.env.DB_NAME || 'sportmaster',
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/sportmaster',
  },
  server: {
    address: process.env.ADDRESS || 'localhost',
    port: process.env.PORT || 3000
  },
  ftp: {
    host: '109.73.14.83',
    port: 21101,
    user: 'sportmaster',
    password: 'J6ad6VrrQr',
  }
};
