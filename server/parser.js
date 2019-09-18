const db = require('./queries');
var ftpClient = require('ftp-client'),
    config = {
        host: '109.73.14.83',
        port: 21101,
        user: 'STEFANEL',
        password: '9eKfYdNtg9'
    },
    options = {
        logging: 'basic',
    },
    client = new ftpClient(config, options);

const sourceDirectory = './';
const destinationDirectory = '../downloadedFiles';
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const table = process.env.TABLE_WITH_THINGS;

const refreshDatabase = () => {
    client.connect(function () {
            client.download(sourceDirectory, destinationDirectory, {
                overwrite: 'older',
            }, () => {
                db.pool.query(`TRUNCATE ${table}`);
                fs.readdir(destinationDirectory, (err, files) => {
                    const filesArray = [];
                    const results = [];
                    // собираем все файлы в массив и определяем последний файл
                    files.map(file => filesArray.push(file));
                    const lastFile = filesArray[filesArray.length-1];
                    console.log(`last file is ${lastFile}`);
                    fs.createReadStream(destinationDirectory + '/' + lastFile)
                        .pipe(csv({
                            separator: ';',
                            headers: ['vendorid', 'title', 'color', 'size', 'barcode', 'oldprice', 'newprice', 'balance', 'brand'],
                        }))
                        .on('data', (data) => {
                            const { vendorid, title, color, size, barcode, oldprice, newprice, balance, brand } = prettifyRowFromCsv(data);
                            try{
                                db.pool.query(`INSERT INTO ${table} VALUES ('${vendorid}', '${title}', '${color}', '${size}', ${barcode}, ${oldprice}, ${newprice}, ${balance}, '${brand}')`);
                            } catch (e) {
                                console.log(e)
                            }

                            
                        })
                        .on('end', () => { 
                            setCapsules(); 
                        })
                });
            });
    });
};

async function setCapsules () {
    const getCountFromDatabase = await db.pool.query(`SELECT COUNT(DISTINCT vendorId) FROM ${table};`)
    const NUMBER_OF_UNIQ_THINGS = getCountFromDatabase.rows[0].count
    const NUMBER_OF_CAPSULES = Math.floor(NUMBER_OF_UNIQ_THINGS / 10)

    const getArrayOfUniqVendorsID = await db.pool.query(`SELECT DISTINCT vendorId FROM ${table};`);
    const arrayOfUniqVendorsID = getArrayOfUniqVendorsID.rows
    try {
        db.pool.query(`TRUNCATE capsules`);
    } catch (e) {
        null
    }
    for (let i = 0; i < arrayOfUniqVendorsID.length; i++) {
        try {
            db.pool.query(`INSERT INTO capsules VALUES ('${arrayOfUniqVendorsID[i].vendorid}', ${0})`)
        } catch (e) {
            null
        }  
    }

    for (let i = 1; i <= NUMBER_OF_CAPSULES; i++) {
        let set = await db.pool.query(`SELECT * FROM capsules WHERE capsule = 0 OFFSET floor(random()*10) LIMIT 10`)
        const arraySets = set.rows
        arraySets.map(string => {
            try {
                db.pool.query(`UPDATE capsules SET capsule=${i} WHERE vendorid='${string.vendorid}'`);
            } catch (e) {
                null
            }
        });
    }
}

function prettifyRowFromCsv (data) {
    let { vendorid, title, color, size, barcode, oldprice, newprice, balance, brand } = data;
    oldprice = oldprice.replace(/\s+/g, '');
    newprice = newprice.replace(/\s+/g, '');
    if(size == 'UN.') {
        size = 'Без размера'
    }
    if (color === '"' || color === '' ) {
        color = 'Цвет не указан'
    }
    barcode = Number(barcode);
    oldprice = parseInt(oldprice, 10);
    newprice = parseInt(newprice, 10);
    balance = Number(balance);
    data = { vendorid, title, color, size, barcode, oldprice, newprice, balance, brand };
    return data;
}

module.exports = { refreshDatabase };