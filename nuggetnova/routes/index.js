var express = require('express');
var router = express.Router();

// TODO: change when in prod
const db = require('../db/dev.index');

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

// login
router.get('/login', (req, res, next) => {
  res.render('login', {title: 'Login'});
}).post('/login', (req, res, next) => {
  let key = req.body.secretKey;
  // encrypt it + salt it ?
  db.query('SELECT * FROM pgf."Authentication" WHERE key = $1;', [key], (err, qres) => {
    let data = qres.rows[0];
    if (data){
      req.session.isauthenticated = true;
      res.redirect('/');
    }else{
      return next(err);
    }
  })
});

module.exports = router;