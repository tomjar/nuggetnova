var express = require('express');
var router = express.Router();
var app = express();
var connection = require('../db/connection.js');
var filesys = require('fs');
var pd = require('../data/post.js');

const db = connection.getDataBaseConnection(app);

// index
router.get('/', (req, res, next) => {
  if (req.session.isauthenticated) {
    pd.getAll(function (err, all) {
      res.render('post/index', {
        title: 'all posts',
        isauthenticated: req.session.isauthenticated,
        posts: all
      });
    })
  } else {
    res.redirect('/');
  }
});

// add
router.get('/add', (req, res, next) => {
  if (req.session.isauthenticated) {
    res.render('post/add', {
      'title': 'add new post',
      'isauthenticated': req.session.isauthenticated,
      'categories': [
        { 'value': 'bicycle', 'name': 'bicycle' },
        { 'value': 'code', 'name': 'code' },
        { 'value': 'gaming', 'name': 'gaming' },
        { 'value': 'hardware', 'name': 'hardware' },
        { 'value': 'life', 'name': 'life' },
        { 'value': 'review', 'name': 'review' }
      ]
    });
  } else {
    res.redirect('/');
  }
}).post('/add', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postHeader = req.body.postHeader,
      postDescription = req.body.postDescription,
      postName = req.body.postName,
      postCategory = req.body.postCategory,
      filePath = `views/p/${postName}.vash`;

    filesys.writeFile(filePath, '', (err) => {
      if (err) {
        return next(err);
      }

      db.query('INSERT INTO nn."Post"(id, header, createtimestamp, modifytimestamp, ispublished, description, name, category) '
        + 'VALUES (uuid_generate_v1(), $1, now(), NULL, false, $2, $3, $4);',
        [postHeader, postDescription, postName, postCategory], (err, qres) => {
          if (err) {
            return next(err);
          }

          res.redirect('/post');
        })

    });

  } else {
    res.redirect('/');
  }
});

// edit/update
router.get('/edit/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;

    db.query('SELECT id, header, ispublished, description, name, category FROM nn."Post" where id = $1;', [id], (err, qres) => {
      if (err) {
        return next(err);
      }

      let data = qres.rows;

      if (data.length <= 0) {
        return next('Nothing found');
      }

      let path = `views/p/${data[0].name}.vash`,
        viewmodel = data.map(d => {
          return {
            'id': d.id,
            'header': d.header,
            'ispublished': d.ispublished,
            'description': d.description,
            'name': d.name,
            'category': d.category,
            'content': '',
            'categories': [
              { 'value': 'bicycle', 'name': 'bicycle' },
              { 'value': 'code', 'name': 'code' },
              { 'value': 'gaming', 'name': 'gaming' },
              { 'value': 'hardware', 'name': 'hardware' },
              { 'value': 'life', 'name': 'life' },
              { 'value': 'review', 'name': 'review' }
            ]
          }
        })[0];

      filesys.readFile(path, (err1, content) => {
        if (err1) {
          filesys.writeFile(path, '', (err2) => {
            if (err2) {
              return next(err2);
            } else {
              res.render('post/edit', {
                title: data.header,
                isauthenticated: req.session.isauthenticated,
                post: viewmodel
              });
            }
          })
        } else {

          viewmodel.content = content;

          res.render('post/edit', {
            title: data.header,
            isauthenticated: req.session.isauthenticated,
            post: viewmodel
          });
        }
      });
    })
  } else {
    res.redirect('/');
  }
}).post('/update', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postHeader = req.body.postHeader,
      postIsPublished = req.body.postIsPublished,
      postDescription = req.body.postDescription,
      postId = req.body.postId,
      postCategory = req.body.postCategory;

    db.query('UPDATE nn."Post" SET category=$1, header=$2, modifytimestamp=now(), ispublished=$3, description=$4 WHERE id = $5;',
      [postCategory, postHeader, postIsPublished, postDescription, postId], (err, qres) => {
        if (err) {
          return next(err)
        }

        res.redirect('/post');
      })
  } else {
    res.redirect('/');
  }
}).post('/write', (req, res, next) => {
  if (req.session.isauthenticated) {
    let postId = req.body.postId,
      content = req.body.postContent,
      name = req.body.postName,
      filePath = `views/p/${name}.vash`;

    const bufferData = new Uint8Array(Buffer.from(content));

    filesys.writeFile(filePath, bufferData, (err) => {
      if (err) {
        return next(err)
      }

      db.query('UPDATE nn."Post" SET modifytimestamp=now() WHERE id = $1;',
        [postId], (err, qres) => {
          if (err) {
            return next(err)
          }

          res.redirect('/post');
        })
    });
  }
})

// activate
router.get('/activate/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;
    db.query('UPDATE nn."Post" SET ispublished=true, modifytimestamp=now() WHERE id = $1;', [id], (err, qres) => {
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
    db.query('UPDATE nn."Post" SET ispublished=false, modifytimestamp=now() WHERE id = $1;', [id], (err, qres) => {
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