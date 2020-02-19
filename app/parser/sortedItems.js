import config from "../config/index";
import thingDAl from "../things/thingsDAL";

const fs = require("fs");
const fastcsv = require("fast-csv");

const stream = fs.createReadStream(
  `${config.fileFolder}smart_mirror_sorted_items.csv`,
);
const csvData = [];

/**
 * read smart_mirror_sorted_items.csv
 * parse rows
 * write rows to database
 * @type {CsvParserStream}
 */
const csvStream = fastcsv
  .parse()
  .on("data", (data) => {
    csvData.push(data);
  })
  .on("end", () => {
    // remove the first line: header
    csvData.shift();

    // connect to the PostgreSQL database
    csvData.map((row) => {
      const result = row[0].split(";");
      thingDAl.insertSortedItems(...result);
    });
    // save csvData
  });

stream.pipe(csvStream);
