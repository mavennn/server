const fs = require('fs');
const fastcsv = require('fast-csv');
import config from '../config/index';
import thingDAl from '../things/thingsDAL';

let stream = fs.createReadStream(config.fileFolder + 'smart_mirror_shk.csv');
let csvData = [];

/**
 * read smart_mirror_shk.csv
 * parse rows
 * write rows to database
 * @type {CsvParserStream}
 */
let csvStream = fastcsv
    .parse()
    .on('data', function(data) {
        csvData.push(data);
    })
    .on('end', function() {
        // remove the first line: header
        csvData.shift();

        // connect to the PostgreSQL database
        csvData.map((row) => {
            let result = row[0].split(';');
            thingDAl.insertShk(...result).catch((e) => console.log(e));
        });
        // save csvData
    });

stream.pipe(csvStream);
