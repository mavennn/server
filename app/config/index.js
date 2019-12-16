require('dotenv').config();

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
    files: {
        shk: process.env.SHK_FILE_PATH,
        rests: process.env.RESTS_FILE_PATH,
        sorted: process.env.SORTED_FILE_PATH,
        recs: process.env.RECS_FILE_PATH,
    },
};
