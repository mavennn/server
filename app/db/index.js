const { Pool } = require('pg');

const pool = new Pool({
    user: 'aleksejgadoev',
    host: 'localhost',
    database: 'smart_mirror_database',
    password: '',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
