var express = require('express');
var router = express.Router();

const db = require('../db');

// index
router.get('/', (req, res, next) => {
    db.query('SELECT * FROM pgf."Post";', (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows;
    res.render('post/index', { title: 'all posts', posts: data});
  })
});

// edit
// now()
// SELECT uuid_generate_v1();
router.get('/edit/:id', (req, res, next) => {
  let id = req.params.id;
  db.query('SELECT * FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows[0];
    res.render('post/edit', { title: 'edit post', post: data});
  })
});

// view
router.get('/view/:id', (req, res, next) => {
  let id = req.params.id;
  db.query('SELECT * FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows[0];
    res.render('post/view', { title: 'view post', post: data});
  })
});

// update
router.post('', (req, res, next) =>{

});


module.exports = router;