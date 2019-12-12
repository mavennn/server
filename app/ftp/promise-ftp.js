import PromiseFtp from 'promise-ftp';
import fs from 'fs';
import config from '../config/index';

const ftp = new PromiseFtp();

ftp.connect(config.ftp)
    .then(function(serverMessage) {
        console.log(serverMessage);
        return ftp.get('smart_mirror_shk.txt');
    })
    .then(function(stream) {
        return new Promise(function(resolve, reject) {
            stream.once('close', resolve);
            stream.once('error', reject);
            stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
        });
    })
    .then(function() {
        return ftp.end();
    });
