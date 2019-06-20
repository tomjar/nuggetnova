
/**
 * @description retrieved the correct database connection file
 */
function getDataBaseConnection() {
  if (process.env.ENVIRONMENT === 'production') {
    return require('../db/prod.index.js')
  } else {
    return require('../db/dev.index')
  }
}

module.exports = { getDataBaseConnection };