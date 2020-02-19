require('dotenv').config();

/*
* Read configuration info from .env file
* .env file must be in root folder
*
* .env file example:
* DB_NAME=
* DB_HOST=
* DB_USER=
* DB_PASSWORD=
* DB_PORT=
* ADDRESS=
* PORT=
* FTP_HOST=
* FTP_PORT=
* FTP_USER=
* FTP_PASSWORD=
* FILES_FOLDER=
* */

module.exports = {
    database: {
        name: process.env.DB_NAME || 'smart_mirror_database',
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || 5432,
    },
    server: {
        address: process.env.ADDRESS || 'localhost',
        port: process.env.PORT || 3000,
    },
    ftp: {
        host: process.env.FTP_HOST,
        port: Number(process.env.FTP_PORT),
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
    },
    fileFolder: process.env.FILES_FOLDER,
};
