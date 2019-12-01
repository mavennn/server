const fs = require("fs");
const XmlStream = require("xml-stream");

const stream = fs.createReadStream("../files/export_msk_new.xml");
const xml = new XmlStream(stream);

xml.collect("categoryId");
xml.collect("picture");
xml.collect("param");

const parseCategories = () => {
  xml.on("endElement: category", (category) => {
    const myCategory = {
      name: category.$text,
      id: Number(category.$.id),
      parentId: Number(category.$.parentId),
    };

    const small = new Category(myCategory);
    console.log(small);
    small.save((err) => {
      if (err) console.log(err);
    });
  });

  xml.on("end", () => console.log("finish parse categories"));
};

const parseThings = () => {
  /* Парсинг шмоток */
  xml.on("endElement: offer", (offer) => {
    const setParams = (params) => {
      const newParams = [];

      params.map((param) => {
        newParams.push({
          name: param.$.name,
          value: param.$text,
        });
      });

      return newParams;
    };

    const getParam = (params, paramName) => {
      let color = "";

      params.map((param) => {
        if (param.$.name === paramName) {
          color = param.$text;
        }
      });

      return color;
    };

    const myThing = {
      id: Number(offer.$.id),
      pid: Number(offer.$.group_id),
      ware: offer.vendorCode,
      available: offer.$.available,
      name: offer.model,
      price: offer.price,
      size: getParam(offer.param, "Размер"),
      color: getParam(offer.param, "Цвет"),
      brand: offer.vendor,
      description: offer.description,
      categories: offer.categories.categoryId.map((el) => parseInt(el, 10)),
      pictures: offer.picture,
      params: setParams(offer.param),
    };

    const small = new Thing(myThing);
    console.log(small);
    small.save((err) => {
      if (err) console.log(err);
    });
  });

  xml.on("end", () => console.log("finish parse offers"));
};

parseCategories();

/* offer
  url: 'https://www.sportmaster.ru/product/1804529/?city_id=0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
  oldprice: '599',
  price: '299',
  currencyId: 'RUR',
  categories: { categoryId: [ '34231', '34232', '33505', '33506', '33508' ] },
  picture: [
    'https://cdn.sptmr.ru/upload/iblock/898/9426440299.jpg',
    'https://cdn.sptmr.ru/upload/resize_cache/iblock/238/112_123_1/9426450299.jpg',
    'https://cdn.sptmr.ru/upload/resize_cache/iblock/329/112_123_1/9426460299.JPG'
  ],
  store: 'false',
  pickup: 'false',
  delivery: 'false',
  local_delivery_cost: '290',
  vendor: 'Nike',
  vendorCode: 'SX47515-L',
  model: 'Носки Nike Cushion Dynamic Arch Quarter, 1 пара',
  description: 'Носки nike cushion dynamic arch quarter разработаны специально для занятий бегом. Отведение влаги ткань nike dri-fit эффективно отводит влагу от кожи.',
  sales_notes: '',
  param: [
    { '$': [Object], '$text': 'Унисекс' },
    { '$': [Object], '$text': 'Взрослые' },
    { '$': [Object], '$text': 'Бег' },
    { '$': [Object], '$text': '96 % нейлон, 4 % эластан' },
    { '$': [Object], '$text': 'Dri-FIT' },
    { '$': [Object], '$text': 'Nike' },
    { '$': [Object], '$text': 'SX4751-043' },
    { '$': [Object], '$text': 'Таиланд' },
    { '$': [Object], '$text': '41-45' },
    { '$': [Object], '$text': 'Носки' },
    { '$': [Object], '$text': 'Носки стандартные' },
    { '$': [Object], '$text': 'Одежда' },
    { '$': [Object], '$text': '2015-2016' },
    { '$': [Object], '$text': 'Черный' }
  ],
  rec: '1391674,1719207,1200440,10341712,10360418,10159284,10068231',
  '$': {
    id: '1804530',
    group_id: '1804529',
    type: 'vendor.model',
    available: 'false'
  }
}
*/
