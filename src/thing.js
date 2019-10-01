const db = require('./db');

// class Thing {
//     constructor ({ brand, color, price, title , size, barcode, vendorcode, img_base64 }) {
//         this.title = title;
//         this.price = price;
//         this.vendorcode = vendorcode;
//         this.brand = brand;
//         this.size = size;
//         this.barcode = barcode;
//         this.color = color;
//         this.img_base64 = img_base64
//     }
    
//     get _title () {
//         return this.title;
//     }

//     get _price () {
//         return this.price;
//     }

//     get _vendorcode() {
//         return this.vendorcode;
//     }

//     get _brand () {
//         return this.brand;
//     }

//     get _size () {
//         return this.size;
//     }

//     get _color () {
//         return this.color;
//     }

//     get _img_base64 () {
//         return this.img_base64;
//     }

//     set _img_base64 (img) {
//         this.img_base64 = img;
//     }

//     get _barcode () {
//         return this.barcode;
//     }

//     set _availableSizes (sizes) {
//         this.availableSizes = sizes
//     }

//     set _availableColors (colors) {
//         this.availableColors = colors;
//     }
// };

class Thing {
    constructor(barcode) {
        this.barcode = barcode;
    }

    async getInfoFromDB () {
        let thing = await db.pool.query(`SELECT * FROM ${db.table} WHERE bar_code = ${this.barcode}`);
        thing = thing.rows[0]; // в thing хранится json объект со всеми полями таблицы базы данных
        this.price = thing.price;
        this.title = thing.title;
        this.color = thing .color;
        this.vendorcode = thing.vendorcode;
        this.id = thing.id;
        this.idCapsule = thing.id_capsule;
        this.imagesCount = thing.images_count;
        this.imagesUrl = thing.images_url;
        this.barcode = thing.barcode
        this.size = thing.size;
        this.brand = thing.brand;
        this.amount = thing.amount;
    }
};

module.exports = { Thing };