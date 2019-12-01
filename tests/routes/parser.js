const Client = require('ftp');
const client = new Client();

const db = require('../../config/db');

const fs = require('fs');
const csv = require('csv-parser');

const IMAGES_FOLDER = '../public/images';
const imagesArray = fs.readdirSync(IMAGES_FOLDER);

const ftpServerConfig = {
    host: '109.73.14.83',
    port: 21101,
    user: 'STEFANEL',
    password: '9eKfYdNtg9',
};

//загрузка последнего файла с ftp сервера
function downloadLastFile () {
    client.on('ready', () => {
        client.list('./', false, (err, list) => {
            const lastFile = list[list.length - 1].name;
            client.get(`${lastFile}`, false, (err, stream) => {
                stream.pipe(fs.createWriteStream(`data.csv`));
                client.end();
            })
        })
    });

    client.connect(ftpServerConfig);
};

let rowCounter = 0;

function insertToDataBase(row) {
    const { price, title, color, vendor_code, id, id_capsule, image_url, images_count, bar_code, size, brand, amount } = row; 
    const QUERY = `INSERT INTO things (price, title, color, vendor_code, id, id_capsule, image_url, images_count, bar_code, size, brand, amount) VALUES (${price}, '${title}', '${color}', '${vendor_code}', ${id}, '${id_capsule}', '${image_url}', ${images_count}, ${bar_code}, '${size}', '${brand}', ${amount})`;
    db.pool.query(QUERY);
}

//считываем построчно csv файл
function parseFile () {
    db.pool.query('TRUNCATE things'); // очищаем таблицу
    fs.createReadStream(`./data.csv`) // открываем файл 
        .pipe(csv({
            separator: ';',
            headers: ['vendor_code', 'title', 'color', 'size', 'bar_code', 'oldprice', 'newprice', 'amount', 'brand']
            }))
        .on('data', (row) => {
            // в row находится каждая строка csv файла в формате json
            // db.pool.query(``);
            const newRow = prettifyRow(row);
            insertToDataBase(newRow);
        })
    rowCounter = 0;
};

function prettifyRow (row) {
    let { vendor_code, title, color, size, bar_code, oldprice, newprice, amount, brand } = row;
    oldprice = oldprice.replace(/\s+/g, '');
    newprice = newprice.replace(/\s+/g, '');
    const price = newprice === '0' ? Number(oldprice) : Number(newprice);

    if (color === '"' || color === '' ) {
        color = 'Цвет не указан'
    }
    const id = rowCounter;
    const id_capsule = '';
    const image_url = null;
    let images_count = getImagesCount(vendor_code);
    bar_code = Number(bar_code);
    if(size == 'UN.' || size == 'TU') {
        size = 'Без размера'
    }
    amount = Number(amount);
    const newRow = { price, title, color, vendor_code, id, id_capsule, image_url, images_count, bar_code, size, brand, amount };
    rowCounter++;
    return newRow;
};

const getImagesCount = (vendor_code) => {
    let counter = 0;
    imagesArray.map(img => {
        let a = img.split('-')[0];
        if (a === vendor_code) counter++;
    });
    return counter;
}

function main () {
    console.log('Обновление базы данных')
    downloadLastFile();
    parseFile();
    console.log('Обновление завершено')
};

module.exports = { main }