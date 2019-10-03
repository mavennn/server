const db = require('./db');
const fs = require('fs');
const Thing = require('./thing').Thing;


const getRecs = async () => {
  const recs = await db.pool.query(`SELECT * FROM ${db.table} WHERE images_count != 0 AND amount != 0 ORDER BY RANDOM() LIMIT 10`);
  let recsArray = [];
  recs.rows.map(thing => {
    let recsThingObject = new Thing(thing);
    recsThingObject._img_base64 = getBase64Image(recsThingObject._vendorcode);
    recsArray.push(recsThingObject);
  });
  return recsArray;
};

const getBase64Image = (vendorcode) => {
  /*
    добавить проверу на наличие image url длля фоток с cdn
  */
  const imagePath = fs.existsSync(`../public/images/${vendorcode}-01.jpg`) 
                      ?`../public/images/${vendorcode}-01.jpg` 
                      : '../public/no_Foto.jpg'
  console.log(imagePath);
  const img64 = 'data:image/jpg;base64, ' + fs.readFileSync(imagePath, 'base64');
  return img64;
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

  if (isThingParamsValid(thing)) {
    const thingObject = new Thing(thing); // создаем объект вещи
    thingObject._availableSizes = await getAvailableSizes(thingObject._vendorcode);
    thingObject._availableColors = await getAvailableColors(thingObject._vendorcode);
    thingObject._img_base64 = getBase64Image(thingObject._vendorcode);
    thingObject._recommendations = await getRecs();
    response.status(200).json(thingObject); // отправляем готовый объект шмотки
  } else {
    throw new Error ('undefined из базы данных');
  }
}

module.exports = {
  getThingByBarcode,
};
