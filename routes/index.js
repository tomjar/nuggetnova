var express = require('express');
var router = express.Router();
var auth = require('../data/auth.js');
var pd = require('../data/post.js');

// home
router.get('/', (req, res, next) => {
  pd.getAllPublishedLastThirtyDays(function (err, lastThirtyDays) {
    if (err) {
      return next(err);
    } else {
      pd.getAllArchived(function (err, yearAndPosts) {
        if (err) {
          return next(err);
        } else {
          res.render('index', {
            'title': 'recent',
            'isauthenticated': req.session.isauthenticated,
            'posts': lastThirtyDays,
            'yearAndPosts': yearAndPosts
          });
        }
      })
    }
  })
});

// about
router.get('/about', (req, res, next) => {
  pd.getAllArchived(function (err, yearAndPosts) {
    if (err) {
      return next(err);
    } else {
      res.render('about', {
        'title': 'about',
        'isauthenticated': req.session.isauthenticated,
        'yearAndPosts': yearAndPosts
      });
    }
  })
});

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/');
    }
  });
});

// login
router.get('/login', (req, res, next) => {
  if (req.session.lockout) {
    res.redirect('../');
  } else {
    // TODO: check if user in the naughty list
    res.render('login', { title: 'Login' });
  }
}).post('/login', (req, res, next) => {
  if (req.session.lockout) {
    res.redirect('../');
  } else {
    // TODO: check if user in the naughty list
    auth.validatePassword(req.body.secretKey, function (valid) {
      if (valid) {
        // welcome valid user
        req.session.isauthenticated = true;
        res.redirect('../');
      } else {
        req.session.lockout = true;
        // TODO: log it
        // TODO: lock out of login page
        // TODO: warn the user
        // TODO: add to naughty list
        res.redirect('../');
      }
    });
  }
});

module.exports = router;