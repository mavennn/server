const { Pool } = require('pg');
require('dotenv').config();

const user = process.env.DATABASE_USER;
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_DATABASE;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT;
const table = process.env.TABLE_WITH_THINGS;

const pool = new Pool({
  user, host, database, password, port
});

async function getThingByBarcode(request, response) {
  const barcode = request.params.barcode.toString();
  let thing = await pool.query(`SELECT * FROM ${table} WHERE barcode = ${barcode}`);
  [thing] = thing.rows;
  const vendor = thing.vendorid.split('.')[0];
  // поиск размеров
  const sz = await pool.query(`SELECT ${table}.size FROM ${table} WHERE vendorId = '${thing.vendorid}'`);
  const sizes = [];
  sz.rows.map((s) => {
    if (!sizes.includes(s.size)) sizes.push(s.size);
    return true;
  });
  thing.sizes = sizes;

  // поиск цветов
  const availableColors = [];
  const colors = await pool.query(`SELECT vendorid, color, barcode FROM things WHERE vendorid ~ '^(${vendor}).+';`);
  colors.rows.map((c) => {
    if (availableColors.findIndex(x => x.color === c.color && x.vendorid === c.vendorid) === -1) {
      availableColors.push(c);
    }
    return true;
  });
  thing.availableColors = availableColors;
  console.log(thing);
  response.status(200).json(thing);
}

async function getRecs(request, response) {
  const groupId = request.params.groupId.toString();
  let Recs = await pool.query(`SELECT * FROM ${table} WHERE group_id = ${groupId}`);
  [Recs] = Recs.rows;
  const result = {
    pictures: Recs.pictures[0],
    id: Recs.id,
    barcode: Recs.barcodes[0],
    model: Recs.model
  };
  response.status(200).json(result);
}

module.exports = {
  getThingByBarcode,
  getRecs,
  pool,
};
