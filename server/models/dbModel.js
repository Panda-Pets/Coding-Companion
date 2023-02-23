// going to have to install this dependency
const { Pool } = require('pg');

const PG_URL = process.env.PG_URL;

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URL,
});

module.exports = {
  query: async (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};