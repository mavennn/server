const db = require('../config/db');
const fs = require('fs');

const getThingCardInfoByBarcode = async (request, response) => {
  const barcode = request.params.barcode;
  const thingCard = {
    title: await getTitleByBarcode(barcode),
    price: await getPriceByBarcode(barcode),
    vendorcode: await getVendorcodeByBarcode(barcode),
    barcode,
  };
  console.log(thingCard);
  response.status(200).json(thingCard);
};

const getRecsByBarcode = async (barcode) => {
  const vendorcode = await getVendorcodeByBarcode(barcode);
  const recs = await db.pool.query(`select distinct vendor_code, bar_code, title, price from ${db.table} where images_count != 0 and vendor_code != '${vendorcode}' limit 10;`);
  let recsArray = [];
  recs.rows.map(rec => recsArray.push({
    barcode: rec.bar_code,
    vendorcode: rec.vendor_code,
    title: rec.title,
    price: rec.price,
  }));
  return recsArray
};

const getThingByBarcode = async (request, response) => {
  const barcode = request.params.barcode;
  const thing = {
    barcode,
    vendorcode: await getVendorcodeByBarcode(barcode),
    title: await getTitleByBarcode(barcode),
    price: await getPriceByBarcode(barcode),
    brand: await getBrandByBarcode(barcode),
    size: await getSizeByBarcode(barcode),
    color: await getColorByBarcode(barcode),
    availableSizes: await getAvailableSizesByBarcode(barcode),
    availableColors: await getAvailableColorsByBarcode(barcode),
    recs: await getRecsByBarcode(barcode)
  };

  console.log(thing);
  response.status(200).json(thing);
};

const getTitleByBarcode = async (barcode) => {
  const title = await db.pool.query(`SELECT title FROM ${db.table} WHERE bar_code = ${barcode}`);
  return title.rows[0].title; // последнее как имя столбца в бд
};

const getVendorcodeByBarcode = async (barcode) => {
  const vendorcode = await db.pool.query(`SELECT vendor_code FROM ${db.table} WHERE bar_code = ${barcode}`);
  return vendorcode.rows[0].vendor_code; // последнее как имя столбца в бд
};

const getBrandByBarcode = async (barcode) => {
  const brand = await db.pool.query(`SELECT brand FROM ${db.table} WHERE bar_code = ${barcode}`);
  return brand.rows[0].brand; // последнее как имя столбца в бд
};

const getSizeByBarcode = async (barcode) => {
  const size = await db.pool.query(`SELECT size FROM ${db.table} WHERE bar_code = ${barcode}`);
  return size.rows[0].size; // последнее как имя столбца в бд
};


const getColorByBarcode = async (barcode) => {
  const color = await db.pool.query(`SELECT color FROM ${db.table} WHERE bar_code = ${barcode}`);
  return color.rows[0].color; // последнее как имя столбца в бд
};

const getPriceByBarcode = async (barcode) => {
  let price = await db.pool.query(`SELECT price FROM ${db.table} WHERE bar_code = ${barcode}`);
  price = price.rows[0].price.toString();
  if (price.length === 5) {
    price = price.slice(0,2) + ' ' + price.slice(2);
  } else if (price.length === 4) {
    price = price.slice(0,1) + ' ' + price.slice(1);
  }
  return price;
};

const getAvailableSizesByBarcode = async (barcode) => {
  let vendorcode = await getVendorcodeByBarcode(barcode);
  const sizes = await db.pool.query(`SELECT size FROM ${db.table} WHERE vendor_code = '${vendorcode}'`);
  let sizesArray = [];
  sizes.rows.map(s => { // добавляем размеры в массив размеров учитывая уникальность
    if (!sizesArray.includes(s)) {
      sizesArray.push(s.size);
    }
  });
  return sizesArray;
};

const getAvailableColorsByBarcode = async (barcode) => {
  const vendorcode = await getVendorcodeByBarcode(barcode);
  const vendorcodeWithoutColor = vendorcode.split('.')[0];
  const colorsFromDatabase = await db.pool.query(`SELECT color, bar_code FROM ${db.table} WHERE vendor_code ~ '^(${vendorcodeWithoutColor}).+';`);
  let colorsArray = [];
  colorsFromDatabase.rows.map(c => {  // добавляем цвета в массив цветов учитыавя уникальность
    if (!colorsArray.includes(c.color)) {
        colorsArray.push(c.color);
    }
  });
  return colorsArray;
};

module.exports = {
  getThingByBarcode,
  getRecsByBarcode,
  getThingCardInfoByBarcode
};
