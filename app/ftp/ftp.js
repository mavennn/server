import fs from 'fs';
import Client from 'ftp';
import config from '../config/index';

const client = new Client();

function downloadFiles() {
    client.on('ready', () => {
        client.list((err, list) => {
            if (err) throw err;
            list.map((file) => {
                client.get(file.name, function(err, stream) {
                    if (err) throw err;
                    stream.once('close', function() {
                        client.end();
                    });
                    stream.pipe(fs.createWriteStream(`./files/${file.name}`));
                });
            });
            client.end();
        });
    });
    client.connect(config.ftp);
}

export default downloadFiles;
