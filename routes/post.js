var express = require('express');
var router = express.Router();
var app = express();
var connection = require('../db/connection.js');
var filesys = require('fs');

const db = connection.getDataBaseConnection(app);

// index
router.get('/', (req, res, next) => {
  if (req.session.isauthenticated) {
    db.query('SELECT id, ispublished, modifytimestamp, createtimestamp, header, category FROM nn."Post";', (err, qres) => {
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
            'header': d.header,
            'category': d.category
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
      filePath = `views/p/${postName}.vash`,
      fileContent = "";

    filesys.writeFile(filePath, fileContent, (err) => {
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

      filesys.readFile(`views/p/${data[0].name}.vash`, (err, content) => {
        if (err) {
          return next(err);
        }

        let viewmodel = data.map(d => {
          return {
            'id': d.id,
            'header': d.header,
            'ispublished': d.ispublished,
            'description': d.description,
            'name': d.name,
            'category': d.category,
            'content': content,
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

        res.render('post/edit', { title: data.header, isauthenticated: req.session.isauthenticated, post: viewmodel });

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
    db.query('UPDATE nn."Post" SET ispublished=true WHERE id = $1;', [id], (err, qres) => {
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