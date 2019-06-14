var express = require('express');
var router = express.Router();

const db = require('../db/dev.index');

// index
router.get('/', (req, res, next) => {
  if(req.session.isauthenticated == false){
    res.redirect('/');
  }

    db.query('SELECT * FROM pgf."Post";', (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows;
    res.render('post/index', { title: 'all posts', posts: data});
  })
});

// add
router.get('/add', (req, res, next) => {
  if(req.session.isauthenticated == false){
    res.redirect('/');
  }

    res.render('post/add', { title: 'add new post', post: ''});
}).post('/add', (req, res, next) => {

  if(req.session.isauthenticated == false){
    res.redirect('/');
  }

  let postTitle = req.body.postTitle;
  // add more fields if needed

  db.query('INSERT INTO pgf."Post"(postid, title, createtimestamp, modifytimestamp)VALUES (uuid_generate_v1(), $1, now(), NULL);', [postTitle], (err, qres) =>{
    if(err){
      return next(err);
    }

    res.redirect('/post');
  })
});

// edit
// now()
// uuid_generate_v1();
router.get('/edit/:id', (req, res, next) => {
  if(req.session.isauthenticated == false){
    res.redirect('/');
  }

  let id = req.params.id;
  db.query('SELECT * FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows[0];
    res.render('post/edit', { title: data.title, post: data});
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
    res.render('post/' + data.title, { title: data.title, post: data});
  })
});

// update
router.post('/update', (req, res, next) => {
  if(req.session.isauthenticated == false){
    res.redirect('/');
  }

  let postTitle = req.body.postTitle,
      postId = req.body.postId;

  db.query('UPDATE pgf."Post" SET title = $1 WHERE postid = $2;', [postTitle, postId], (err, qres) =>{
    if(err){
      return next(err)
    }
    let data = qres.rows[0];
    res.redirect('/post');
  })
});

// delete
router.get('/delete/:id', (req, res, next) => {

  if(req.session.isauthenticated == false){
    res.redirect('/');
  }

  let id = req.params.id;
  db.query('DELETE FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
    if (err) {
      return next(err)
    }
    
    res.redirect('/post');
  })
});


module.exports = router;