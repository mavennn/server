const fs = require('fs');
const fastcsv = require('fast-csv');
import config from '../config/index';
import thingDAl from '../things/thingsDAL';

const sortedFilePath = config.files.sorted;

let stream = fs.createReadStream(sortedFilePath);
let csvData = [];

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
            thingDAl.insertSortedItems(...result);
        });
        // save csvData
    });

stream.pipe(csvStream);
