var express = require('express');
var router = express.Router();

const db = require('../db');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM pgf."Post";', (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows;
    res.render('index', { title: 'nugget nova', posts: data});
  })
});

router.get('/about', (req, res, next) => {
  res.render('about', null);
});

module.exports = router;