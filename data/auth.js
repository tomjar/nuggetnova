var crypto = require('crypto');
var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection();

var Auth = {

    /**
     * @description hash password with sha512.
     * thanks to https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
     * @param {string} password
     * @param {string} salt 
     */
    hashPassword: function (password, salt) {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('hex');
    },

    /**
     * @description validates the super secret password
     * @param {String} password the attempted password
     * @param {Object} db 
     * @param {Function} callback a function to be called after validation
     */
    validatePassword(password, callback) {
        db.query('SELECT * FROM nn."Supersecretpassword";', [], (err, qres) => {
            if (err) {
                return next(err)
            } else {
                let data = qres.rows[0],
                    salt = data.salt,
                    supersecretpassword = data.key,
                    tempsupersecretpassword = this.hashPassword(password, salt),
                    valid = supersecretpassword === tempsupersecretpassword;

                callback(valid);
            }
        })
    }
};

module.exports = Auth;