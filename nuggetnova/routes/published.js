var express = require('express');
var router = express.Router();
var app = express();
var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection(app);

// view
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    db.query('SELECT * FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
      if (err) {
        return next(err)
      }
      let data = qres.rows[0];
      res.render('published/' + data.title, { title: data.title, isauthenticated: req.session.isauthenticated, post: data });
    })
  });

  module.exports = router;