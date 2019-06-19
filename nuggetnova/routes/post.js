var express = require('express');
var router = express.Router();
var app = express();
var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection(app);

// index
router.get('/', (req, res, next) => {
  if (req.session.isauthenticated) {
    db.query('SELECT * FROM pgf."Post";', (err, qres) => {
      if (err) {
        return next(err)
      }
      let data = qres.rows;
      res.render('post/index', { title: 'all posts', isauthenticated: req.session.isauthenticated, posts: data });
    })
  } else {
    res.redirect('/');
  }
});

// view
router.get('/view/:id', (req, res, next) => {
  let id = req.params.id;
  db.query('SELECT * FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows[0];
    res.render('published/' + data.title, { title: data.title, isauthenticated: req.session.isauthenticated, post: data });
  })
});

// add
router.get('/add', (req, res, next) => {
  if (req.session.isauthenticated) {
    res.render('post/add', { title: 'add new post', isauthenticated: req.session.isauthenticated, post: '' });
  } else {
    res.redirect('/');
  }
}).post('/add', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postTitle = req.body.postTitle,
        postPublish = req.body.postPublish,
        postDescription = req.body.postDescription;

    // add more fields if needed
    db.query('INSERT INTO pgf."Post"(postid, title, createtimestamp, modifytimestamp, publishpost,description) VALUES (uuid_generate_v1(), $1, now(), NULL, $2, $3);', [postTitle, postPublish, postDescription], (err, qres) => {
      if (err) {
        return next(err);
      }

      res.redirect('/post');
    })

  } else {
    res.redirect('/');
  }
});

// edit
router.get('/edit/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;
    db.query('SELECT * FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
      if (err) {
        return next(err)
      }
      let data = qres.rows[0];
      res.render('post/edit', { title: data.title, isauthenticated: req.session.isauthenticated, post: data });
    })

  } else {
    res.redirect('/');
  }
});

// update
router.post('/update', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postPublish = req.body.postPublish,
        postDescription = req.body.postDescription,
        postId = req.body.postId;

    db.query('UPDATE pgf."Post" SET modifytimestamp=now(), publishpost=$1, description=$2 WHERE postid = $3;', [postPublish, postDescription, postId], (err, qres) => {
      if (err) {
        return next(err)
      }

      res.redirect('/post');
    })
  } else {
    res.redirect('/');
  }
});

// delete/deactivate
router.get('/delete/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;
    db.query('UPDATE pgf."Post" SET publishpost=false WHERE postid = $1;', [id], (err, qres) => {
      if (err) {
        return next(err)
      }
      res.redirect('/post');
    })

  } else {
    res.redirect('/');
  }
});

module.exports = router;