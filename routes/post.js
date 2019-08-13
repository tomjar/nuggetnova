var express = require('express');
var router = express.Router();
var pd = require('../data/post.js');
var pce = require('../data/postcategoryenum.js');


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
        { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
        { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
        { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
        { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
        { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
        { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
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
      postBody = req.body.postBody;

    pd.insertPost(postHeader, postDescription, postName, postCategory, postBody, function (err) {
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

// update
router.get('/update/:id', (req, res, next) => {
  if (req.session.isauthenticated) {
    let id = req.params.id;

    pd.getPostById(id, function (err, post) {
      if (err) {
        return next(err);
      } else {
        let viewmodel = {
          'id': post.id,
          'header': post.header,
          'ispublished': post.ispublished,
          'description': post.description,
          'name': post.name,
          'category': post.category,
          'body': post.body,
          'categories': [
            { 'value': pce.Bicycle.toLowerCase(), 'name': pce.Bicycle.toLowerCase() },
            { 'value': pce.Code.toLowerCase(), 'name': pce.Code.toLowerCase() },
            { 'value': pce.Gaming.toLowerCase(), 'name': pce.Gaming.toLowerCase() },
            { 'value': pce.Hardware.toLowerCase(), 'name': pce.Hardware.toLowerCase() },
            { 'value': pce.Life.toLowerCase(), 'name': pce.Life.toLowerCase() },
            { 'value': pce.Review.toLowerCase(), 'name': pce.Review.toLowerCase() }
          ]
        };

        res.render('post/edit', {
          title: viewmodel.header,
          isauthenticated: req.session.isauthenticated,
          post: viewmodel
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
      postCategory = req.body.postCategory,
      postBody = req.body.postBody;

    pd.updatePost(postCategory, postHeader, postIsPublished, postDescription, postBody, postId, function (err, result) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
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

// view
router.get('/view/:name', (req, res, next) => {
  let name = req.params.name;

  pd.getPostByName(name, function (err, post) {
    if (err) {
      return next(err);
    } else {
      pd.getAllArchived(function (err, yearAndPosts) {
        if (err) {
          return next(err);
        } else {

          let viewmodel = {
            'id': post.id,
            'description': post.description,
            'header': post.header,
            'name': post.name,
            'createtimestamp': post.createtimestamp.toLocaleString('en-US', { timeZone: 'UTC' }),
            'modifytimestamp': post.modifytimestamp ? post.modifytimestamp.toLocaleString('en-US', { timeZone: 'UTC' }) : '',
            'category': post.category,
            'body': post.body
          };

          res.render('post/view', {
            title: viewmodel.header,
            isauthenticated: req.session.isauthenticated,
            post: viewmodel,
            yearAndPosts: yearAndPosts
          });
        }
      })
    }
  })
});

module.exports = router;