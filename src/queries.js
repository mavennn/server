const db = require('./db');
const Thing = require('./thing').Thing;

async function getAvailableSizes (vendorcode) {
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

async function getAvailableColors (vendorcode) {
  if (vendorcode != undefined) {
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

  const thingObject = new Thing(thingParams); // создаем объект вещи

  // добавляем размеры к вещи
  let availableSizes = await getAvailableSizes(thingObject.vendorcode); 
  thingObject.availableSizes = availableSizes;

  // добавляем цвета к вещи
  let availableColors = await getAvailableColors(thingObject.vendorcode); 
  thingObject.availableColors = availableColors;

  let thingObjectString = JSON.stringify(thingObject);
  console.log(thingObject);
  response.status(200).json(thingObjectString); // отправляем готовый объект шмотки
  // // how to convert JPG to BASE64
  // // var imageAsBase64 = fs.readFileSync('../public/images/sea.jpg', 'base64');
}
module.exports = {
  getThingByBarcode,
};
