var express = require('express');
var router = express.Router();
var filesys = require('fs');
var pd = require('../data/post.js');

// index
router.get('/', (req, res, next) => {
  if (req.session.isauthenticated) {
    pd.getAll(function (err, all) {
      if (err) {
        return next(err);
      } else {
        res.render('post/index', {
          title: 'all posts',
          isauthenticated: req.session.isauthenticated,
          posts: all
        });
      }
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
      } else {
        pd.insertPost(postHeader, postDescription, postName, postCategory, function (err) {
          if (err) {
            return next(err);
          } else {
            res.redirect('/post');
          }
        })
      }
    });

  } else {
    res.redirect('/');
  }
});

// edit/update
router.get('/edit/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;

    pd.getPostById(id, function (err, post) {
      if (err) {
        return next(err);
      } else {
        let path = `views/p/${post.name}.vash`,
          viewmodel = {
            'id': post.id,
            'header': post.header,
            'ispublished': post.ispublished,
            'description': post.description,
            'name': post.name,
            'category': post.category,
            'content': '',
            'categories': [
              { 'value': 'bicycle', 'name': 'bicycle' },
              { 'value': 'code', 'name': 'code' },
              { 'value': 'gaming', 'name': 'gaming' },
              { 'value': 'hardware', 'name': 'hardware' },
              { 'value': 'life', 'name': 'life' },
              { 'value': 'review', 'name': 'review' }
            ]
          };


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
      }
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

    pd.updatePost(postCategory, postHeader, postIsPublished, postDescription, postId, function (err, result) {
      if (err) {
        return next(err);
      } else {
        console.log('update result...');
        console.log(result);
        res.redirect('/');
      }
    });
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
        return next(err);
      } else {
        pd.updatePostModifiedTimestamp(postId, function (err, result) {
          if (err) {
            return next(err);
          } else {
            res.redirect('/post');
          }
        })
      }
    });
  }
});

// activate
router.get('/activate/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;
    pd.updatePostPublished(true, id, function (err, result) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/post');
      }
    })
  } else {
    res.redirect('/');
  }
});

// deactivate
router.get('/deactivate/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;
    pd.updatePostPublished(false, id, function (err, result) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/post');
      }
    })
  } else {
    res.redirect('/');
  }
});

module.exports = router;