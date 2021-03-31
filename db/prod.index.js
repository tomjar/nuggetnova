const { Pool } = require('pg')

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
}

const pool = new Pool(config)
pool.connect().then(client => {
  console.log('connected');
})
.catch(err => console.error('error connecting', err.stack))
.then(() => pool.end)

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}