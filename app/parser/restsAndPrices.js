const fs = require('fs');
const fastcsv = require('fast-csv');
import thingDAl from '../things/thingsDAL';
let stream = fs.createReadStream(
    '/Users/aleksejgadoev/WebstormProjects/server/files/smart_mirror_rests_and_prices.csv'
);
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
            thingDAl
                .insertRestsAndPrices(...result)
                .catch((e) => console.log(e));
        });
        // save csvData
    });

stream.pipe(csvStream);
