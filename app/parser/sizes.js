import ThingsDAL from '../things/thingsDAL';
import db from '../db';
import fs from 'fs';
import config from '../config/index';
import XmlStream from 'xml-stream';

const stream = fs.createReadStream(config.fileFolder + 'export_msk_new.xml');
const xml = new XmlStream(stream);
const thingsDAL = new ThingsDAL(db);

xml.collect('categoryId');
xml.collect('picture');
xml.collect('param');

const parseSizes = () => {
    xml.on('endElement: offer', (offer) => {
        console.log(offer);
    });
};

parseSizes();
