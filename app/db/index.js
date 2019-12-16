const { Pool } = require('pg');
import config from '../config/index';

const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.name,
    password: config.database.password,
    port: config.database.password,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
