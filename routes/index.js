var express = require('express');
var router = express.Router();
var app = express();
var auth = require('../auth/index.js');
var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection(app);

// home
router.get('/', (req, res, next) => {
    db.query('SELECT * FROM pgf."Post" WHERE publishpost = true ORDER BY createtimestamp DESC;', (err, qres) => {
    if (err) {
      return next(err)
    }
    // var today = new Date()
    // var priorDate = new Date().setDate(today.getDate()-30)

    let data = qres.rows,
        today = new Date(),
        priorDate = new Date().setDate(today.getDate() - 30),
        lastThirtyDays = data.filter(item => {
            return item.createtimestamp.getTime() >= priorDate;
        }),
        uniqueYears = data.map(item => {
            return item.createtimestamp.getFullYear();
          }).filter((item, index, arr) => {  
            return arr.indexOf(item) === index;
          }),

        yearAndPosts = uniqueYears.map(uy => {
          return {'year': uy, 'posts': data.filter(p => {
              return p.createtimestamp.getFullYear() === uy;
          })}
        });
        
    res.render('index', { title: 'nuggetnova', isauthenticated: req.session.isauthenticated, posts: lastThirtyDays, yearAndPosts: yearAndPosts});
  })
});

// about
router.get('/about', (req, res, next) => {
  res.render('about', {title: 'about', isauthenticated: req.session.isauthenticated});
});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err) {
    if (err){
      return next(err);
    }
    res.redirect('/');
  });
});

// login
router.get('/login', (req, res, next) => {
  // TODO: check if user in the naughty list
  res.render('login', {title: 'Login'});
}).post('/login', (req, res, next) => {
  // TODO: check if user in the naughty list
  auth.validatePassword(req.body.secretKey, db, function(valid){
    if (valid){
      // welcome valid user
      req.session.isauthenticated = true;
      res.redirect('../');
    } else{
      // TODO: log it
      // TODO: lock out of login page
      // TODO: warn the user
      // TODO: add to naughty list
      res.redirect('../');
    }
  });
});

module.exports = router;