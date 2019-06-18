var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var app = express();

function getDataBaseConnection(app){
  if (app.get('env') === 'production'){
    return require('../db/prod.index.js')
  }else{
    return require('../db/dev.index')
  }
}

const db = getDataBaseConnection(app);

// home
router.get('/', (req, res, next) => {
    db.query('SELECT * FROM pgf."Post" WHERE publishpost = true ORDER BY createtimestamp DESC;', (err, qres) => {
    if (err) {
      return next(err)
    }

    let data = qres.rows;
    res.render('index', { title: 'nugget nova', isauthenticated: req.session.isauthenticated, posts: data});
  })
});

// about
router.get('/about', (req, res, next) => {
  res.render('about', {title: 'about'});
});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});


/**
 * @description hash password with sha512. https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function hashPassword(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest('hex');
};

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function generateRandomSalt(length){
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') /** convert to hexadecimal format */
          .slice(0,length);   /** return required number of characters */
};

function validatePassword(password, callback){
  db.query('SELECT * FROM pgf."Supersecretpassword";', [], (err, qres) => {
    if (err) {
      return next(err)
    }
    
    let data = qres.rows[0],
        salt = data.salt,
        supersecretpassword = data.key,
        tempsupersecretpassword = hashPassword(password, salt),
        valid = supersecretpassword === tempsupersecretpassword;

        console.log(supersecretpassword);
        console.log(tempsupersecretpassword);
        callback(valid);
  })
}

// login
router.get('/login', (req, res, next) => {
  // TODO: check if user in the naughty list
  res.render('login', {title: 'Login'});
}).post('/login', (req, res, next) => {
  // TODO: check if user in the naughty list
  validatePassword(req.body.secretKey, function(valid){
    if (valid){
      // welcome valid user
      req.session.isauthenticated = true;
      res.redirect('/');
    } else{
      // TODO: log it
      // TODO: lock out of login page
      // TODO: warn the user
      // TODO: add to naughty list
      return next('');
    }
  });
});

module.exports = router;