var crypto = require('crypto');

/**
 * @description hash password with sha512.
 *  https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
 * @param {string} password
 * @param {string} salt 
 */
function hashPassword(password, salt) {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};

/**
* @description generates random string of characters i.e salt
* @param {number} length - Length of the random string.
*/
function generateRandomSalt(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

/**
 * @description validates the super secret password
 * @param {String} password 
 * @param {Object} db 
 * @param {Function} callback 
 */
function validatePassword(password, db, callback) {
  db.query('SELECT * FROM nn."Supersecretpassword";', [], (err, qres) => {
    if (err) {
      return next(err)
    }

    let data = qres.rows[0],
      salt = data.salt,
      supersecretpassword = data.key,
      tempsupersecretpassword = hashPassword(password, salt),
      valid = supersecretpassword === tempsupersecretpassword;
    callback(valid);
  })
}

module.exports = { generateRandomSalt, validatePassword };