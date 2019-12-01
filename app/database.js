const { Pool } = require('pg');

const user = process.env.DATABASE_USER;
const host = process.env.DATABASE_HOST;
const database = process.env.DATABASE_DATABASE;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT;
const table = process.env.TABLE_WITH_THINGS;

const pool = new Pool({
    user, host, database, password, port, table
});

module.exports = {
    pool,
    user,
    host,
    database,
    password,
    port,
    table,
};