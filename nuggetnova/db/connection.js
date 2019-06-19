
/**
 * @description retrieved the correct database connection file
 * @param {Object} app express()
 */
function getDataBaseConnection(app){
    if (app.get('env') === 'production'){
      return require('../db/prod.index.js')
    }else{
      return require('../db/dev.index')
    }
  }

  module.exports = {getDataBaseConnection};