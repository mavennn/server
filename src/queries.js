const db = require('./db');
const fs = require('fs');
const Thing = require('./thing').Thing;

const getBase64Image = (vendorcode) => {
  if (fs.existsSync(`../public/images/${vendorcode}-01.jpg`)) { // если есть фото
    return fs.readFileSync(`../public/images/${vendorcode}-01.jpg`, 'base64');
  } else {
    console.log(`нет фотографии для вещи ${vendorcode}`);
    return  fs.readFileSync(`../public/no_foto.png`, 'base64');
  }
}

const getAvailableSizes = async (vendorcode) => {
  const sizes = await db.pool.query(`SELECT size FROM ${db.table} WHERE vendor_code = '${vendorcode}'`);
  let sizesArray = [];
  if (sizes.rows === undefined) {
    throw new Error ('Ошибка чтения размеров из базы данных');
  }
  sizes.rows.map(s => { // добавляем размеры в массив размеров учитывая уникальность
    if (!sizesArray.includes(s)) {
      sizesArray.push(s.size);
    }
  });
  return sizesArray;
};

 const getAvailableColors = async (vendorcode) => {
  if (vendorcode !== undefined) {
    const vendorcodeWithoutColor = vendorcode.split('.')[0];
    const colorsFromDatabase = await db.pool.query(`SELECT color, bar_code FROM ${db.table} WHERE vendor_code ~ '^(${vendorcodeWithoutColor}).+';`);
    let colorsArray = [];
    colorsFromDatabase.rows.map(c => {  // добавляем цвета в массив цветов учитыавя уникальность
      if (!colorsArray.includes(c.color)) {
          colorsArray.push(c.color);
      }
    });
    return colorsArray;
  } else {
    throw new Error ('vendorcode is undefined in getAvailableColors');
  }
}

const isThingParamsValid = (thingParams) => {
  for (k in thingParams) {
    if (k === undefined) {
      return false;
    }
  }
  return true;
}

async function getThingByBarcode(request, response) {
  const barcode = request.params.barcode.toString();
  //получаем всю инфу о вещи из бд
  let thing = await db.pool.query(`SELECT * FROM ${db.table} WHERE bar_code = ${barcode}`);
  thing = thing.rows[0]; // в thing хранится json объект со всеми полями таблицы базы данных
  const thingParams = {
    title: thing.title,
    vendorcode: thing.vendor_code,
    price: thing.price,
    size: thing.size,
    brand: thing.brand,
    color: thing.color,
    barcode: thing.bar_code,
  };

  if (isThingParamsValid(thingParams)) {
    const thingObject = new Thing(thingParams); // создаем объект вещи
    thingObject._availableSizes = await getAvailableSizes(thingObject.vendorcode);
    thingObject._availableColors = await getAvailableColors(thingObject.vendorcode);
    thingObject._img_base64 = getBase64Image(thingObject.vendorcode);  

    response.status(200).json(thingObject); // отправляем готовый объект шмотки
  } else {
    console.log(thingParams);
    throw new Error ('undefined из базы данных');
  }
}

module.exports = {
  getThingByBarcode,
};
