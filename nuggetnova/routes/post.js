var express = require('express');
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
// now()
// uuid_generate_v1();
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

// view
router.get('/view/:id', (req, res, next) => {
  let id = req.params.id;
  db.query('SELECT * FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
    if (err) {
      return next(err)
    }
    let data = qres.rows[0];
    res.render('post/' + data.title, { title: data.title, isauthenticated: req.session.isauthenticated, post: data });
  })
});

// update
router.post('/update', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postTitle = req.body.postTitle,
      postPublish = req.body.postPublish,
      postDescription = req.body.postDescription,
      postId = req.body.postId;

    db.query('UPDATE pgf."Post" SET title=$1, modifytimestamp=now(), publishpost=$2, description=$3 WHERE postid = $4;', [postTitle, postPublish, postDescription, postId], (err, qres) => {
      if (err) {
        return next(err)
      }

      res.redirect('/post');
    })
  } else {
    res.redirect('/');
  }
});

// delete
router.get('/delete/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;
    db.query('DELETE FROM pgf."Post" where postid = $1;', [id], (err, qres) => {
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