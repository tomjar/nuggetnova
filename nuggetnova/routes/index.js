var express = require('express');
var router = express.Router();

const db = require('../db/dev.index');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM pgf."Post";', (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows,
        isAuth = false;
    if (req.session.isauthenticated){
      isAuth = req.session.isauthenticated;
    }else{
      isAuth = false;
    }

    res.render('index', { title: 'nugget nova', authenticated: isAuth, posts: data});
  })
});

router.get('/login', (req, res, next) => {
  res.render('login', {title: 'Login'});
}).post('/login', (req, res, next) => {
  let key = req.body.secretKey;
  // encrypt it + salt it
  // validate it
  db.query('SELECT * FROM pgf."Authentication" WHERE key = $1;', [key], (err, qres) => {
    let data = qres.rows[0];
    
    if (data){
      req.session.isauthenticated = true;
      res.redirect('/');
    }
  })
});

module.exports = router;