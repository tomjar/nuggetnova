var express = require('express');
var router = express.Router();
var app = express();
var connection = require('../db/connection.js');

const db = connection.getDataBaseConnection(app);

// index
router.get('/', (req, res, next) => {
  if (req.session.isauthenticated) {
    db.query('SELECT id, ispublished, modifytimestamp, createtimestamp, header FROM nn."Post";', (err, qres) => {
      if (err) {
        return next(err)
      }
      let data = qres.rows,
        viewmodel = data.map(d => {
          return {
            'id': d.id,
            'ispublished': d.ispublished ? 'Yes' : 'No',
            'modifytimestamp': d.modifytimestamp ? d.modifytimestamp.toLocaleString('en-US', { timeZone: 'UTC' }) : '',
            'createtimestamp': d.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
            'header': d.header
          }
        });

      res.render('post/index', { title: 'all posts', isauthenticated: req.session.isauthenticated, posts: viewmodel });
    })
  } else {
    res.redirect('/');
  }
});

// add
router.get('/add', (req, res, next) => {
  if (req.session.isauthenticated) {
    res.render('post/add', {
      title: 'add new post',
      isauthenticated: req.session.isauthenticated
    });
  } else {
    res.redirect('/');
  }
}).post('/add', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postHeader = req.body.postHeader,
      postIsPublished = req.body.postIsPublished,
      postDescription = req.body.postDescription,
      postName = req.body.postName;

    db.query('INSERT INTO nn."Post"(id, header, createtimestamp, modifytimestamp, ispublished, description, name) '
      + 'VALUES (uuid_generate_v1(), $1, now(), NULL, $2, $3, $4);', [postHeader, postIsPublished, postDescription, postName], (err, qres) => {
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

    db.query('SELECT id, header, ispublished, description, name FROM nn."Post" where id = $1;', [id], (err, qres) => {
      if (err) {
        return next(err)
      }
      let data = qres.rows[0];
      res.render('post/edit', { title: data.header, isauthenticated: req.session.isauthenticated, post: data });
    })

  } else {
    res.redirect('/');
  }
});

// update
router.post('/update', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postHeader = req.body.postHeader,
      postIsPublished = req.body.postIsPublished,
      postDescription = req.body.postDescription,
      postId = req.body.postId;

    db.query('UPDATE nn."Post" SET header=$1, modifytimestamp=now(), ispublished=$2, description=$3 WHERE id = $4;',
      [postHeader, postIsPublished, postDescription, postId], (err, qres) => {
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
    db.query('DELETE FROM nn."Post" WHERE id = $1;', [id], (err, qres) => {
      if (err) {
        return next(err)
      }
      res.redirect('/post');
    })

  } else {
    res.redirect('/');
  }
});

// deactivate
router.get('/deactivate/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;
    db.query('UPDATE nn."Post" SET ispublished=false WHERE id = $1;', [id], (err, qres) => {
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