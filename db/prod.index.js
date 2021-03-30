const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.HEROKU_POSTGRESQL_BLACK_URL
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}