var express = require('express');
var router = express.Router();
var auth = require('../data/auth.js');
var pd = require('../data/post.js');
var sd = require('../data/settings.js');

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
  let aboutViewModel = {
    'title': 'about',
    'about_section': '',
    'isauthenticated': req.session.isauthenticated,
    'yearAndPosts': []
  };

  sd.getSettings(function (err, settings) {
    if (err) {
      return next(err);
    } else {
      pd.getAllArchived(function (err, yearAndPosts) {
        if (err) {
          return next(err);
        } else {
          aboutViewModel.yearAndPosts = yearAndPosts;
          try {
            aboutViewModel.about_section = settings.about_section;
          } catch (excep) {
            sd.insertDefaultSettings(function (err, result) {
              if (err) {
                return next(err);
              } else {
                aboutViewModel.about_section = result.defaultSettings[1];
              }
            })
          } finally {
            res.render('about', aboutViewModel);
          }
        }
      })
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
    res.render('login', { title: 'login' });
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