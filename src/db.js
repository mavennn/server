const { Pool } = require('pg');
const Env = require('./utils').Env;
const env = new Env();

const user = env.getDatabaseUser();
const host = env.getDatabaseHost();
const database = env.getDatabaseName();
const password = env.getDatabasePassword();
const port = env.getDatabasePort();
const table = env.getTableWithThings();

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
