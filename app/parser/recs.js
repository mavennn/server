const fs = require('fs');
const fastcsv = require('fast-csv');
import config from '../config/index';
import thingDAl from '../things/thingsDAL';

let stream = fs.createReadStream(config.fileFolder + 'smart_mirror_recs.csv');
let csvData = [];

let csvStream = fastcsv
    .parse()
    .on('data', function(data) {
        csvData.push(data);
    })
    .on('end', function() {
        // remove the first line: header
        csvData.shift();

        // insert to the PostgreSQL database
        csvData.map((row) => {
            let result = row[0].split(';');
            thingDAl.insertRecs(...result);
        });
    });

stream.pipe(csvStream);
